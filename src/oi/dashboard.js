import './dashboard.css';

const app = document.querySelector('#app');

let projects = [];
let selected = 0;
let dirty = false;
let statusText = '';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function field(label, value, { type = 'text', multiline = false, name } = {}) {
  const wrap = document.createElement('div');
  const lab = el('label', '', label);
  lab.htmlFor = name;
  const input = document.createElement(multiline ? 'textarea' : 'input');
  if (!multiline) input.type = type;
  input.id = name;
  input.name = name;
  input.value = value ?? '';
  wrap.append(lab, input);
  return { wrap, input };
}

function checkbox(label, checked, name) {
  const lab = el('label', 'check');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = name;
  input.checked = checked;
  lab.append(input, document.createTextNode(label));
  return { wrap: lab, input };
}

function blankProject() {
  return {
    id: `project-${Date.now()}`,
    image: '',
    link: '',
    github: 'https://github.com/ogulcanismik',
    placeholder: false,
    locales: ['en', 'tr'],
    tags: [],
    en: { title: 'New project', description: '', status: 'In Development', type: 'Game' },
    tr: { title: '', description: '', status: '', type: '' },
  };
}

function localesOf(project) {
  return project.locales?.length ? project.locales : ['en', 'tr'];
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

function renderLogin(message = '') {
  app.replaceChildren();
  const gate = el('main', 'gate');
  const card = el('form', 'gate__card');
  card.append(
    el('p', 'eyebrow', '// oi'),
    el('h1', '', 'Projects'),
    el('p', 'muted', 'Sign in to add and edit the creations list.')
  );
  const password = field('Password', '', { type: 'password', name: 'password' });
  password.input.autocomplete = 'current-password';
  password.input.required = true;
  const button = el('button', 'btn btn--accent', 'Enter');
  button.type = 'submit';
  const error = el('p', 'error', message);
  card.append(password.wrap, button, error);
  card.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    error.textContent = '';
    try {
      await api('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ password: password.input.value }),
      });
      await loadProjects();
    } catch (err) {
      error.textContent = err.message;
      button.disabled = false;
    }
  });
  gate.append(card);
  app.append(gate);
  password.input.focus();
}

function readEditor(form) {
  const data = new FormData(form);
  const locales = [];
  if (form.querySelector('[name="locale-en"]').checked) locales.push('en');
  if (form.querySelector('[name="locale-tr"]').checked) locales.push('tr');
  const tags = String(data.get('tags') || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    id: String(data.get('id') || '').trim().toLowerCase(),
    image: String(data.get('image') || '').trim(),
    link: String(data.get('link') || '').trim(),
    github: String(data.get('github') || '').trim(),
    placeholder: form.querySelector('[name="placeholder"]').checked,
    locales,
    tags,
    en: {
      title: String(data.get('en-title') || '').trim(),
      description: String(data.get('en-description') || '').trim(),
      status: String(data.get('en-status') || '').trim(),
      type: String(data.get('en-type') || '').trim(),
    },
    tr: {
      title: String(data.get('tr-title') || '').trim(),
      description: String(data.get('tr-description') || '').trim(),
      status: String(data.get('tr-status') || '').trim(),
      type: String(data.get('tr-type') || '').trim(),
    },
  };
}

function captureEditor() {
  const form = app.querySelector('.editor');
  if (!form || !projects[selected]) return;
  projects[selected] = readEditor(form);
}

function renderApp() {
  captureEditor();
  app.replaceChildren();
  const shell = el('main', 'shell');
  const top = el('header', 'topbar');
  const titles = el('div');
  titles.append(el('p', 'eyebrow', '// ogulcanismik.com/oi'), el('h1', '', 'Projects'));
  const actions = el('div', 'topbar__actions');
  const site = el('a', 'site-link', '← site');
  site.href = '/';
  const logout = el('button', 'btn', 'Sign out');
  logout.type = 'button';
  logout.addEventListener('click', async () => {
    await api('/api/auth', { method: 'DELETE' });
    projects = [];
    renderLogin();
  });
  const save = el('button', 'btn btn--accent', dirty ? 'Save changes' : 'Saved');
  save.type = 'button';
  save.disabled = !dirty;
  save.addEventListener('click', () => saveProjects(save));
  actions.append(site, logout, save);
  top.append(titles, actions);

  const layout = el('div', 'layout');
  layout.append(renderList(), renderEditor());
  const status = el('p', 'status', statusText);
  shell.append(top, layout, status);
  app.append(shell);
}

function renderList() {
  const aside = el('aside', 'list');
  const tools = el('div', 'list__tools');
  const add = el('button', 'btn', 'Add');
  add.type = 'button';
  add.addEventListener('click', () => {
    captureEditor();
    projects.push(blankProject());
    selected = projects.length - 1;
    dirty = true;
    statusText = '';
    renderApp();
  });
  const up = el('button', 'btn', 'Up');
  const down = el('button', 'btn', 'Down');
  const remove = el('button', 'btn', 'Delete');
  up.type = down.type = remove.type = 'button';
  up.disabled = selected <= 0;
  down.disabled = selected >= projects.length - 1;
  remove.disabled = !projects.length;
  up.addEventListener('click', () => move(-1));
  down.addEventListener('click', () => move(1));
  remove.addEventListener('click', () => {
    if (!projects[selected]) return;
    const title = projects[selected].en?.title || projects[selected].id;
    if (!confirm(`Delete “${title}”? This is kept until you save.`)) return;
    projects.splice(selected, 1);
    selected = Math.max(0, selected - 1);
    dirty = true;
    statusText = '';
    renderApp();
  });
  tools.append(add, up, down, remove);
  aside.append(tools);

  projects.forEach((project, index) => {
    const button = el('button', `project${index === selected ? ' is-selected' : ''}`);
    button.type = 'button';
    button.append(
      el('strong', '', project.en?.title || project.tr?.title || 'Untitled'),
      el('span', '', project.id)
    );
    button.addEventListener('click', () => {
      if (index === selected) return;
      captureEditor();
      selected = index;
      renderApp();
    });
    aside.append(button);
  });

  return aside;
}

function move(direction) {
  captureEditor();
  const next = selected + direction;
  if (next < 0 || next >= projects.length) return;
  const [item] = projects.splice(selected, 1);
  projects.splice(next, 0, item);
  selected = next;
  dirty = true;
  statusText = '';
  renderApp();
}

function renderEditor() {
  const project = projects[selected];
  const form = el('form', 'editor');
  form.addEventListener('submit', (event) => event.preventDefault());
  if (!project) {
    form.append(el('p', 'muted', 'No projects yet. Add one to start.'));
    return form;
  }

  const locales = localesOf(project);
  const id = field('Id', project.id, { name: 'id' });
  const image = field('Image path or URL', project.image, { name: 'image' });
  const fileLabel = el('label', '', 'Upload image');
  const file = document.createElement('input');
  file.type = 'file';
  file.accept = 'image/png,image/jpeg,image/webp,image/gif';
  file.addEventListener('change', () => uploadImage(file));
  const link = field('Live link', project.link, { type: 'url', name: 'link' });
  const github = field('GitHub link', project.github, { type: 'url', name: 'github' });
  const tags = field('Tags, comma separated', (project.tags || []).join(', '), { name: 'tags' });
  const showEn = checkbox('Show in English', locales.includes('en'), 'locale-en');
  const showTr = checkbox('Show in Turkish', locales.includes('tr'), 'locale-tr');
  const placeholder = checkbox('Mark as placeholder', Boolean(project.placeholder), 'placeholder');

  const checks = el('div', 'row');
  checks.append(showEn.wrap, showTr.wrap, placeholder.wrap);

  const columns = el('div', 'columns');
  columns.append(localeFields('English', 'en', project.en), localeFields('Turkish', 'tr', project.tr));

  form.append(id.wrap, image.wrap, fileLabel, file, link.wrap, github.wrap, tags.wrap, checks, columns);
  if (project.image) {
    const preview = document.createElement('img');
    preview.className = 'preview';
    preview.alt = '';
    preview.src = project.image;
    form.append(preview);
  }

  form.addEventListener('input', () => {
    dirty = true;
    const save = app.querySelector('.btn--accent');
    if (save) {
      save.disabled = false;
      save.textContent = 'Save changes';
    }
  });

  return form;
}

function localeFields(title, key, copy = {}) {
  const box = el('section');
  box.append(el('h2', 'eyebrow', title));
  const titleField = field('Title', copy.title, { name: `${key}-title` });
  const status = field('Status', copy.status, { name: `${key}-status` });
  const type = field('Type', copy.type, { name: `${key}-type` });
  const meta = el('div', 'row');
  meta.append(status.wrap, type.wrap);
  const description = field('Description', copy.description, { name: `${key}-description`, multiline: true });
  box.append(titleField.wrap, meta, description.wrap);
  return box;
}

async function uploadImage(input) {
  const file = input.files?.[0];
  if (!file) return;
  statusText = 'Uploading image…';
  renderApp();
  try {
    const payload = await fileToPayload(file);
    const result = await api('/api/upload', { method: 'POST', body: JSON.stringify(payload) });
    captureEditor();
    const current = projects[selected];
    if (current) current.image = result.path;
    const imageInput = app.querySelector('[name="image"]');
    if (imageInput) imageInput.value = result.path;
    dirty = true;
    statusText = 'Image uploaded. Save to keep it on the project.';
  } catch (error) {
    statusText = error.message;
  }
  renderApp();
  imageField = null;
}

function fileToPayload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve({
        filename: file.name,
        type: file.type,
        data: result.slice(result.indexOf(',') + 1),
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function saveProjects(button) {
  captureEditor();
  button.disabled = true;
  statusText = 'Saving…';
  const status = app.querySelector('.status');
  if (status) status.textContent = statusText;
  try {
    const result = await api('/api/projects', {
      method: 'PUT',
      body: JSON.stringify({ projects }),
    });
    projects = result.projects;
    dirty = false;
    statusText =
      result.saved === 'github'
        ? 'Saved to GitHub. The live site updates when the deploy finishes.'
        : 'Saved. The site picks this up on refresh.';
    renderApp();
  } catch (error) {
    statusText = error.message;
    dirty = true;
    renderApp();
  }
}

async function loadProjects() {
  const result = await api('/api/projects');
  projects = result.projects;
  selected = 0;
  dirty = false;
  statusText = '';
  renderApp();
}

const session = await api('/api/auth').catch(() => ({ ok: false }));
if (session.ok) await loadProjects();
else renderLogin();
