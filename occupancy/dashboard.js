/*
 * dashboard.js
 * Doluluk panosu. HTML iskeletini doldurur; React yok.
 *
 * FastAPI adresi. Bos birakilirsa sayfa simule oda gosterir.
 * Ornek: const API_BASE = 'http://192.168.1.100:8000';
 *
 * GET  {API}/occupancy/current
 * GET  {API}/occupancy/history?hours=24
 * GET  {API}/nodes
 * WS   {API}/ws/live
 *
 * current: headcount, active_devices, filtered_out, zero_offset, slope,
 *          intercept, consensus_required, node_count, nodes_online, updated_at
 * history: { points: [ { t, headcount, active_devices } ] }
 * nodes:   { nodes: [ { node_id, online, last_seen, wifi_sightings, ble_sightings } ] }
 * MAC alani yok. Tarayici baska origin'den cagirirsa FastAPI CORS acmali.
 */
const API_BASE = '';

// WIFI_FULL / BLE_FULL: cubuk %100 sayilan gozlem adedi (son batch).
const WIFI_FULL = 24;
const BLE_FULL = 16;

// CALIBRATION: demo odanin dogrusu. Canli API kendi katsayilarini gonderir.
const CALIBRATION = {
  slope: 0.68,
  intercept: 0.2,
  zeroOffset: 1.6,
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHART_W = 800;
const CHART_H = 280;
const CHART_PAD = { l: 40, r: 12, t: 16, b: 32 };

// mode: "live" backend dener, "demo" simule odayi zorlar.
let mode = 'live';
// hours: grafik penceresi (saat).
let hours = 6;
let status = API_BASE ? 'connecting' : 'unconfigured';
let room = null;
let hoverIndex = null;
let demoTimer = 0;
let pollTimer = 0;
let ws = null;

/*
 * deriveWsUrl
 * HTTP kokeninden /ws/live adresi uretir. https -> wss.
 */
function deriveWsUrl(apiBase) {
  const url = new URL(apiBase);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/ws/live';
  url.search = '';
  url.hash = '';
  return url.toString();
}

const WS_URL = API_BASE ? deriveWsUrl(API_BASE) : '';

/*
 * fmt
 * Katsayi ve dara icin en fazla 2 basamak.
 */
function fmt(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return '—';
  }
  return String(Math.round(n * 100) / 100);
}

/*
 * formatClock
 * Yerel saat HH:MM. Grafik ekseni ve tooltip.
 */
function formatClock(ms) {
  const t = typeof ms === 'number' ? ms : Date.parse(ms);
  if (!Number.isFinite(t)) {
    return '—';
  }
  return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/*
 * formatAgo
 * Son batch ne kadar eski. "just now" / "12s ago".
 */
function formatAgo(isoOrMs) {
  if (isoOrMs === null || isoOrMs === undefined || isoOrMs === '') {
    return 'no batch yet';
  }
  const t = typeof isoOrMs === 'number' ? isoOrMs : Date.parse(isoOrMs);
  if (!Number.isFinite(t)) {
    return 'no batch yet';
  }
  const sec = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (sec < 10) {
    return 'just now';
  }
  if (sec < 60) {
    return sec + 's ago';
  }
  const min = Math.round(sec / 60);
  if (min < 60) {
    return min + ' min ago';
  }
  return formatClock(t);
}

/*
 * formatAxis
 * 12 saatten uzun pencerede gun + saat. spanMs: pencere genisligi.
 */
function formatAxis(ms, spanMs) {
  const clock = formatClock(ms);
  if (spanMs > 12 * 60 * 60 * 1000) {
    const day = new Date(ms).toLocaleDateString([], { month: 'short', day: 'numeric' });
    return day + ' ' + clock;
  }
  return clock;
}

/*
 * num
 * Bozuk JSON alanini sayiya cevirir.
 */
function num(value, fallback) {
  const n = Number(value);
  if (Number.isFinite(n)) {
    return n;
  }
  return fallback;
}

/*
 * estimateHeadcount
 * headcount = round(slope * (active_devices - dara) + intercept), alt sinir 0.
 * activeDevices: Redis + 2/3 oy sonrasi cihaz adedi.
 */
function estimateHeadcount(activeDevices, cal) {
  const raw = cal.slope * (activeDevices - cal.zeroOffset) + cal.intercept;
  const rounded = Math.round(raw);
  if (rounded < 0) {
    return 0;
  }
  return rounded;
}

/*
 * expectedDevices
 * SADECE demo. Sabah bos, ogleden sonra kalabalik bir oda taklit eder.
 */
function expectedDevices(date) {
  const hour = date.getHours() + date.getMinutes() / 60;
  let level = 0.4;
  if (hour >= 8 && hour < 11) {
    level = 2 + (hour - 8) * 2.2;
  } else if (hour >= 11 && hour < 17) {
    level = 9 + Math.sin(((hour - 11) / 6) * Math.PI) * 5;
  } else if (hour >= 17 && hour < 21) {
    level = 8 - (hour - 17) * 1.8;
  }
  const wobble = Math.sin(date.getTime() / 900000) * 1.1;
  if (level + wobble < 0) {
    return 0;
  }
  return level + wobble;
}

/*
 * buildCurrent
 * Demo anlik gorunum. filteredOut: 2 node'dan az oy alan gozlemler.
 */
function buildCurrent(activeDevices, nowMs) {
  let filteredOut = Math.round(activeDevices * 0.35);
  if (activeDevices > 0) {
    filteredOut += 2;
  }
  return {
    headcount: estimateHeadcount(activeDevices, CALIBRATION),
    activeDevices: activeDevices,
    filteredOut: filteredOut,
    zeroOffset: CALIBRATION.zeroOffset,
    slope: CALIBRATION.slope,
    intercept: CALIBRATION.intercept,
    consensusRequired: 2,
    nodeCount: 3,
    nodesOnline: 3,
    updatedAt: new Date(nowMs).toISOString(),
  };
}

/*
 * buildNodes
 * NODE_ID 1..3. Demo'da hepsi cevrimici. Sayilar son batch gozlem adedidir.
 */
function buildNodes(activeDevices, nowMs) {
  const nodes = [];
  for (let id = 1; id <= 3; id++) {
    nodes.push({
      nodeId: id,
      online: true,
      lastSeen: new Date(nowMs).toISOString(),
      wifiSightings: activeDevices + id * 2,
      bleSightings: Math.max(0, Math.round(activeDevices * 0.45) + id),
    });
  }
  return nodes;
}

/*
 * createDemoRoom
 * Son 24 saat, 5 dakikalik ornekler. Grafik bos acilmasin.
 */
function createDemoRoom() {
  const now = Date.now();
  const stepMs = 5 * 60 * 1000;
  const count = (24 * 60) / 5;
  const points = [];
  for (let i = count - 1; i >= 0; i--) {
    const t = now - i * stepMs;
    const active = Math.round(expectedDevices(new Date(t)));
    points.push({
      t: t,
      headcount: estimateHeadcount(active, CALIBRATION),
      activeDevices: active,
    });
  }
  const last = points[points.length - 1];
  return {
    current: buildCurrent(last.activeDevices, now),
    points: points,
    nodes: buildNodes(last.activeDevices, now),
  };
}

/*
 * stepDemo
 * Cihaz sayisini gun egrisina dogru 1 adim kaydirir. 24 saatten eskileri atar.
 */
function stepDemo(prev) {
  const now = Date.now();
  const before = prev && prev.current ? prev.current.activeDevices : 0;
  const target = Math.round(expectedDevices(new Date(now)));
  let active = before;
  if (target > before) {
    active = before + 1;
  } else if (target < before) {
    active = before - 1;
  }
  if (active < 0) {
    active = 0;
  }
  const current = buildCurrent(active, now);
  const cutoff = now - 24 * 60 * 60 * 1000;
  const points = [];
  const previousPoints = prev && prev.points ? prev.points : [];
  for (let i = 0; i < previousPoints.length; i++) {
    if (previousPoints[i].t >= cutoff) {
      points.push(previousPoints[i]);
    }
  }
  points.push({
    t: now,
    headcount: current.headcount,
    activeDevices: active,
  });
  return {
    current: current,
    points: points,
    nodes: buildNodes(active, now),
  };
}

/*
 * normalizeCurrent
 * Yilan_case JSON -> pano alanlari. zeroOffset: bos oda darasi (cihaz).
 */
function normalizeCurrent(raw) {
  const body = raw || {};
  return {
    headcount: num(body.headcount, 0),
    activeDevices: num(body.active_devices, 0),
    filteredOut: num(body.filtered_out, 0),
    zeroOffset: num(body.zero_offset, 0),
    slope: num(body.slope, 0),
    intercept: num(body.intercept, 0),
    consensusRequired: num(body.consensus_required, 2),
    nodeCount: num(body.node_count, 3),
    nodesOnline: num(body.nodes_online, 0),
    updatedAt: body.updated_at || new Date().toISOString(),
  };
}

/*
 * normalizePoint
 * Gecmis ornek. t milisaniyeye cevrilir.
 */
function normalizePoint(raw) {
  const body = raw || {};
  const parsed = typeof body.t === 'number' ? body.t : Date.parse(body.t);
  return {
    t: Number.isFinite(parsed) ? parsed : Date.now(),
    headcount: num(body.headcount, 0),
    activeDevices: num(body.active_devices, 0),
  };
}

/*
 * normalizeNode
 * Tek ESP32 son batch ozeti. MAC listesi istenmez.
 */
function normalizeNode(raw) {
  const body = raw || {};
  return {
    nodeId: num(body.node_id, 0),
    online: Boolean(body.online),
    lastSeen: body.last_seen || null,
    wifiSightings: num(body.wifi_sightings, 0),
    bleSightings: num(body.ble_sightings, 0),
  };
}

/*
 * getJson
 * 4 saniye zaman asimi. Ulasilmayan LAN adresi sayfayi kilitlemesin.
 */
async function getJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(function () {
    ctrl.abort();
  }, 4000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/*
 * fetchSnapshot
 * Anlik sayim + 24 saat gecmis + 3 node.
 */
async function fetchSnapshot(apiBase, historyHours) {
  const currentJson = await getJson(apiBase + '/occupancy/current');
  const historyJson = await getJson(apiBase + '/occupancy/history?hours=' + historyHours);
  const nodesJson = await getJson(apiBase + '/nodes');
  const points = [];
  const rawPoints = historyJson.points || [];
  for (let i = 0; i < rawPoints.length; i++) {
    points.push(normalizePoint(rawPoints[i]));
  }
  const nodes = [];
  const rawNodes = nodesJson.nodes || [];
  for (let i = 0; i < rawNodes.length; i++) {
    nodes.push(normalizeNode(rawNodes[i]));
  }
  return {
    current: normalizeCurrent(currentJson),
    points: points,
    nodes: nodes,
  };
}

/*
 * applyLiveMessage
 * WebSocket karesi. 20 sn'den sik gelen ornek son noktayi gunceller.
 */
function applyLiveMessage(prev, msg) {
  const current = normalizeCurrent(msg);
  const parsed = Date.parse(current.updatedAt);
  const stamp = Number.isFinite(parsed) ? parsed : Date.now();
  const sample = {
    t: stamp,
    headcount: current.headcount,
    activeDevices: current.activeDevices,
  };
  const cutoff = stamp - 24 * 60 * 60 * 1000;
  const points = [];
  const previous = prev.points || [];
  for (let i = 0; i < previous.length; i++) {
    if (previous[i].t >= cutoff) {
      points.push(previous[i]);
    }
  }
  const last = points[points.length - 1];
  if (!last || stamp - last.t > 20000) {
    points.push(sample);
  } else {
    points[points.length - 1] = sample;
  }
  let nodes = prev.nodes;
  if (msg && Array.isArray(msg.nodes)) {
    nodes = [];
    for (let i = 0; i < msg.nodes.length; i++) {
      nodes.push(normalizeNode(msg.nodes[i]));
    }
  }
  return { current: current, points: points, nodes: nodes };
}

/*
 * openLiveSocket
 * /ws/live. Bozuk JSON yutulur; REST yoklamasi yedektir.
 */
function openLiveSocket(wsUrl, onMessage) {
  if (!wsUrl) {
    return null;
  }
  const socket = new WebSocket(wsUrl);
  socket.onmessage = function (event) {
    try {
      onMessage(JSON.parse(event.data));
    } catch (err) {
      // Tek bozuk kare panoyu dusurmesin.
    }
  };
  return socket;
}

/*
 * lineValue
 * Formul kartindaki yuvarlanmis sonuc. Buyuk sayi sunucunun headcount alanidir.
 */
function lineValue(current) {
  const raw = current.slope * (current.activeDevices - current.zeroOffset) + current.intercept;
  const rounded = Math.round(raw);
  if (rounded < 0) {
    return 0;
  }
  return rounded;
}

/*
 * visiblePoints
 * 24 saatlik diziden secilen saati keser.
 */
function visiblePoints() {
  if (!room) {
    return [];
  }
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  const visible = [];
  for (let i = 0; i < room.points.length; i++) {
    if (room.points[i].t >= cutoff) {
      visible.push(room.points[i]);
    }
  }
  return visible;
}

/*
 * statusCopy
 * Rozet metni. Demo sayilar canli olcum gibi gorunmesin.
 */
function statusCopy(kind) {
  if (kind === 'live') {
    return { badge: 'Live', note: 'Readings come from the occupancy API.', cls: 'badge live' };
  }
  if (kind === 'connecting') {
    return { badge: 'Connecting', note: 'Contacting the occupancy API.', cls: 'badge connecting' };
  }
  if (kind === 'stale') {
    return { badge: 'Link interrupted', note: 'The last live sample stays on screen.', cls: 'badge warn' };
  }
  if (kind === 'fallback') {
    return {
      badge: 'API offline',
      note: 'The occupancy API did not answer. This room is simulated.',
      cls: 'badge warn',
    };
  }
  if (kind === 'unconfigured') {
    return {
      badge: 'No API',
      note: 'Set API_BASE at the top of dashboard.js to attach FastAPI. This room is simulated.',
      cls: 'badge demo',
    };
  }
  return {
    badge: 'Demo data',
    note: 'Demo is selected. Switch to Live when the nodes are posting.',
    cls: 'badge demo',
  };
}

/*
 * svgEl
 * SVG dugumu. class dahil nitelikleri yazar.
 */
function svgEl(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  const keys = Object.keys(attrs);
  for (let i = 0; i < keys.length; i++) {
    node.setAttribute(keys[i], attrs[keys[i]]);
  }
  return node;
}

/*
 * drawChart
 * Kisi (altin) ve aktif cihaz (yesil) cizgileri. points bos ise bekleme metni.
 */
function drawChart() {
  const svg = document.getElementById('chart');
  const empty = document.getElementById('chart-empty');
  const tip = document.getElementById('chart-tip');
  const points = visiblePoints();
  svg.replaceChildren();

  if (points.length < 2) {
    empty.hidden = false;
    svg.hidden = true;
    tip.hidden = true;
    return;
  }

  empty.hidden = true;
  svg.hidden = false;

  let peak = 4;
  for (let i = 0; i < points.length; i++) {
    const high = Math.max(points[i].headcount, points[i].activeDevices);
    if (high > peak) {
      peak = high;
    }
  }
  peak = Math.ceil(peak);

  const t0 = points[0].t;
  const t1 = points[points.length - 1].t;
  const span = Math.max(1, t1 - t0);
  const innerW = CHART_W - CHART_PAD.l - CHART_PAD.r;
  const innerH = CHART_H - CHART_PAD.t - CHART_PAD.b;

  function xOf(t) {
    return CHART_PAD.l + ((t - t0) / span) * innerW;
  }
  function yOf(value) {
    return CHART_PAD.t + (1 - value / peak) * innerH;
  }

  function buildLine(key) {
    let d = '';
    for (let i = 0; i < points.length; i++) {
      const cmd = i === 0 ? 'M' : 'L';
      d += cmd + xOf(points[i].t).toFixed(1) + ' ' + yOf(points[i][key]).toFixed(1) + ' ';
    }
    return d.trim();
  }

  const peopleLine = buildLine('headcount');
  const baseline = yOf(0);
  const peopleArea =
    peopleLine +
    ' L' +
    xOf(t1).toFixed(1) +
    ' ' +
    baseline.toFixed(1) +
    ' L' +
    xOf(t0).toFixed(1) +
    ' ' +
    baseline.toFixed(1) +
    ' Z';

  const yTicks = [0, Math.round(peak / 2), peak];
  for (let i = 0; i < yTicks.length; i++) {
    const y = yOf(yTicks[i]);
    svg.appendChild(
      svgEl('line', {
        class: 'grid-line',
        x1: CHART_PAD.l,
        x2: CHART_W - CHART_PAD.r,
        y1: y,
        y2: y,
      })
    );
    const label = svgEl('text', {
      class: 'axis-label',
      x: CHART_PAD.l - 8,
      y: y + 4,
      'text-anchor': 'end',
    });
    label.textContent = String(yTicks[i]);
    svg.appendChild(label);
  }

  svg.appendChild(svgEl('path', { d: peopleArea, class: 'people-area' }));
  svg.appendChild(svgEl('path', { d: buildLine('activeDevices'), class: 'device-line' }));
  svg.appendChild(svgEl('path', { d: peopleLine, class: 'people-line' }));

  const labelCount = span > 12 * 60 * 60 * 1000 ? 4 : 5;
  for (let i = 0; i < labelCount; i++) {
    const ratio = labelCount === 1 ? 0 : i / (labelCount - 1);
    const t = t0 + ratio * span;
    let anchor = 'middle';
    if (i === 0) {
      anchor = 'start';
    } else if (i === labelCount - 1) {
      anchor = 'end';
    }
    const tick = svgEl('text', {
      class: 'axis-label',
      x: xOf(t),
      y: CHART_H - 8,
      'text-anchor': anchor,
    });
    tick.textContent = formatAxis(t, span);
    svg.appendChild(tick);
  }

  const last = points[points.length - 1];
  svg.appendChild(
    svgEl('circle', {
      class: 'now-dot',
      cx: xOf(last.t),
      cy: yOf(last.headcount),
      r: 4,
    })
  );
  svg.setAttribute(
    'aria-label',
    'Occupancy history. Latest estimate ' + last.headcount + ' people, ' + last.activeDevices + ' devices.'
  );

  if (hoverIndex !== null && points[hoverIndex]) {
    const x = xOf(points[hoverIndex].t);
    svg.appendChild(
      svgEl('line', {
        class: 'hover-line',
        x1: x,
        x2: x,
        y1: CHART_PAD.t,
        y2: CHART_H - CHART_PAD.b,
      })
    );
    let leftPct = (x / CHART_W) * 100;
    if (leftPct < 4) {
      leftPct = 4;
    }
    if (leftPct > 96) {
      leftPct = 96;
    }
    tip.hidden = false;
    tip.style.left = leftPct + '%';
    tip.style.transform = leftPct > 72 ? 'translateX(-100%)' : 'translateX(0)';
    document.getElementById('tip-time').textContent = formatClock(points[hoverIndex].t);
    document.getElementById('tip-people').textContent = 'People ' + points[hoverIndex].headcount;
    document.getElementById('tip-devices').textContent = 'Devices ' + points[hoverIndex].activeDevices;
  } else {
    tip.hidden = true;
  }
}

/*
 * barWidth
 * Gozlem sayisini cubuk yuzdesine cevirir. full: %100 kabul edilen adet.
 */
function barWidth(count, full) {
  if (count <= 0) {
    return 0;
  }
  const pct = (count / full) * 100;
  if (pct < 6) {
    return 6;
  }
  if (pct > 100) {
    return 100;
  }
  return pct;
}

/*
 * nodeSlot
 * Eksik NODE_ID kartini cevrimdisi doldurur. Her zaman 1, 2, 3 gosterilir.
 */
function nodeSlot(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeId === id) {
      return nodes[i];
    }
  }
  return {
    nodeId: id,
    online: false,
    lastSeen: null,
    wifiSightings: 0,
    bleSightings: 0,
  };
}

/*
 * drawNodes
 * Uc ESP32 karti. waiting: ilk baglantida "offline" dememek icin.
 */
function drawNodes(waiting) {
  const root = document.getElementById('nodes');
  root.replaceChildren();
  const nodes = room && room.nodes ? room.nodes : [];
  for (let id = 1; id <= 3; id++) {
    const node = nodeSlot(nodes, id);
    const online = node.online && !waiting;
    const card = document.createElement('article');
    card.className = online ? 'node' : 'node offline';

    const head = document.createElement('header');
    head.className = 'node-head';
    const title = document.createElement('h3');
    title.textContent = 'Node ' + id;
    const dot = document.createElement('span');
    dot.className = online ? 'dot on' : 'dot';
    const state = document.createElement('span');
    state.className = 'node-state';
    if (waiting) {
      state.textContent = 'Waiting';
    } else if (online) {
      state.textContent = 'Online';
    } else {
      state.textContent = 'Offline';
    }
    head.append(title, dot, state);

    const seen = document.createElement('p');
    seen.className = 'node-seen';
    seen.textContent = waiting ? 'Waiting for the first batch' : 'Last batch ' + formatAgo(node.lastSeen);

    card.append(head, seen, meterRow('Wi-Fi probes', waiting ? null : node.wifiSightings, WIFI_FULL, false));
    card.append(meterRow('BLE adverts', waiting ? null : node.bleSightings, BLE_FULL, true));
    root.appendChild(card);
  }
}

/*
 * meterRow
 * Bir RF kaynagi icin etiket + cubuk. count null ise deger gizlenir.
 */
function meterRow(label, count, full, ble) {
  const row = document.createElement('div');
  row.className = 'meter-row';
  const line = document.createElement('div');
  line.className = 'meter-label';
  const name = document.createElement('span');
  name.textContent = label;
  const value = document.createElement('span');
  value.textContent = count === null ? '—' : String(count);
  line.append(name, value);
  const meter = document.createElement('div');
  meter.className = ble ? 'meter ble' : 'meter';
  meter.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('span');
  fill.style.width = (count === null ? 0 : barWidth(count, full)) + '%';
  meter.appendChild(fill);
  row.append(line, meter);
  return row;
}

/*
 * paint
 * Ekrandaki sayilari, rozeti, grafigi ve node kartlarini room durumuna yazar.
 */
function paint() {
  const copy = statusCopy(status);
  const badge = document.getElementById('badge');
  badge.textContent = copy.badge;
  badge.className = copy.cls;
  document.getElementById('status-note').textContent = copy.note;

  const modeButtons = document.querySelectorAll('[data-mode]');
  for (let i = 0; i < modeButtons.length; i++) {
    const on = modeButtons[i].getAttribute('data-mode') === mode;
    modeButtons[i].setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  const hourButtons = document.querySelectorAll('[data-hours]');
  for (let i = 0; i < hourButtons.length; i++) {
    const on = Number(hourButtons[i].getAttribute('data-hours')) === hours;
    hourButtons[i].setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  const current = room ? room.current : null;
  document.getElementById('headcount').textContent = current ? String(current.headcount) : '—';
  document.getElementById('updated').textContent = current
    ? 'Updated ' + formatAgo(current.updatedAt)
    : 'Waiting for the first sample';
  document.getElementById('active').textContent = current ? String(current.activeDevices) : '—';
  document.getElementById('rejected').textContent = current ? String(current.filteredOut) : '—';
  document.getElementById('nodes-online').textContent = current
    ? current.nodesOnline + '/' + current.nodeCount
    : '—';
  document.getElementById('vote-line').textContent = current
    ? 'Vote needs ' + current.consensusRequired + ' of ' + current.nodeCount
    : 'Vote needs 2 of 3';

  if (current) {
    document.getElementById('formula').textContent =
      'round( ' +
      fmt(current.slope) +
      ' × (' +
      fmt(current.activeDevices) +
      ' − ' +
      fmt(current.zeroOffset) +
      ') + ' +
      fmt(current.intercept) +
      ' )';
    document.getElementById('formula-result').textContent = String(lineValue(current));
    document.getElementById('slope').textContent = fmt(current.slope);
    document.getElementById('offset').textContent = fmt(current.zeroOffset);
    document.getElementById('intercept').textContent = fmt(current.intercept);
  }

  drawChart();
  drawNodes(!room);
}

/*
 * stopDemo
 * Simule oda zamanlayicisini keser. Canli veri gelince cagrilir.
 */
function stopDemo() {
  window.clearInterval(demoTimer);
  demoTimer = 0;
}

/*
 * beginDemo
 * Simule odayi baslatir ve 4 saniyede bir bir adim ilerletir.
 */
function beginDemo(nextStatus) {
  stopDemo();
  room = createDemoRoom();
  status = nextStatus;
  paint();
  demoTimer = window.setInterval(function () {
    room = stepDemo(room);
    paint();
  }, 4000);
}

/*
 * pull
 * REST anlik + gecmis + node. Basarida demo sayacini keser ve soketi acar.
 */
async function pull() {
  const snap = await fetchSnapshot(API_BASE, 24);
  stopDemo();
  room = snap;
  status = 'live';
  const closed = !ws || ws.readyState === WebSocket.CLOSED;
  if (closed) {
    ws = openLiveSocket(WS_URL, function (msg) {
      if (!room) {
        return;
      }
      room = applyLiveMessage(room, msg);
      paint();
    });
  }
  paint();
}

/*
 * startSource
 * Live API dener. Adres yoksa veya Demo seciliyse simule oda acilir.
 */
function startSource() {
  stopDemo();
  window.clearInterval(pollTimer);
  pollTimer = 0;
  if (ws) {
    ws.close();
    ws = null;
  }
  hoverIndex = null;

  if (mode === 'demo') {
    beginDemo('demo');
    return;
  }
  if (!API_BASE) {
    beginDemo('unconfigured');
    return;
  }

  status = 'connecting';
  room = null;
  paint();
  pull().catch(function () {
    beginDemo('fallback');
  });
  pollTimer = window.setInterval(function () {
    pull().catch(function () {
      if (status === 'live') {
        status = 'stale';
        paint();
      }
    });
  }, 10000);
}

/*
 * onChartMove
 * Fare x'ini ornek indeksine cevirir. Tooltip drawChart icinde cizilir.
 */
function onChartMove(event) {
  const points = visiblePoints();
  const svg = event.currentTarget;
  if (points.length < 2) {
    return;
  }
  const rect = svg.getBoundingClientRect();
  const touch = event.touches && event.touches.length > 0 ? event.touches[0] : null;
  const clientX = touch ? touch.clientX : event.clientX;
  const x = ((clientX - rect.left) / rect.width) * CHART_W;
  const innerW = CHART_W - CHART_PAD.l - CHART_PAD.r;
  if (x < CHART_PAD.l || x > CHART_W - CHART_PAD.r) {
    hoverIndex = null;
    drawChart();
    return;
  }
  const ratio = (x - CHART_PAD.l) / innerW;
  let index = Math.round(ratio * (points.length - 1));
  if (index < 0) {
    index = 0;
  }
  if (index > points.length - 1) {
    index = points.length - 1;
  }
  hoverIndex = index;
  drawChart();
}

/*
 * bindControls
 * Live/Demo ve 1s/6s/24s dugmeleri. Grafik fare ve dokunmatik okumasi.
 */
function bindControls() {
  const modeButtons = document.querySelectorAll('[data-mode]');
  for (let i = 0; i < modeButtons.length; i++) {
    modeButtons[i].addEventListener('click', function (event) {
      mode = event.currentTarget.getAttribute('data-mode');
      startSource();
    });
  }
  const hourButtons = document.querySelectorAll('[data-hours]');
  for (let i = 0; i < hourButtons.length; i++) {
    hourButtons[i].addEventListener('click', function (event) {
      hours = Number(event.currentTarget.getAttribute('data-hours'));
      hoverIndex = null;
      paint();
    });
  }
  const chart = document.getElementById('chart');
  chart.addEventListener('mousemove', onChartMove);
  chart.addEventListener('mouseleave', function () {
    hoverIndex = null;
    drawChart();
  });
  chart.addEventListener('touchstart', onChartMove, { passive: true });
  chart.addEventListener('touchmove', onChartMove, { passive: true });
}

bindControls();
startSource();
