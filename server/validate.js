const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PATH_PATTERN = /^\/[a-zA-Z0-9/_\-.]+$/;

function fail(message) {
  const error = new Error(message);
  error.status = 400;
  throw error;
}

function text(value, max, label) {
  if (value == null) return '';
  if (typeof value !== 'string') fail(`${label} must be text.`);
  const trimmed = value.trim();
  if (trimmed.length > max) fail(`${label} is too long.`);
  return trimmed;
}

function optionalUrl(value, label) {
  const trimmed = text(value, 500, label);
  if (!trimmed) return '';
  if (trimmed.startsWith('/')) {
    if (!PATH_PATTERN.test(trimmed)) fail(`${label} path is invalid.`);
    return trimmed;
  }
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    fail(`${label} must be a URL.`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    fail(`${label} must start with http:// or https://.`);
  }
  return url.toString();
}

function localeBlock(block, label, titleRequired) {
  const source = block && typeof block === 'object' ? block : {};
  const title = text(source.title, 140, `${label} title`);
  if (titleRequired && !title) fail(`${label} title is required.`);
  return {
    title,
    description: text(source.description, 2000, `${label} description`),
    status: text(source.status, 48, `${label} status`),
    type: text(source.type, 48, `${label} type`),
  };
}

export function validateProjects(input) {
  if (!Array.isArray(input)) fail('Projects must be a list.');
  if (input.length > 40) fail('Too many projects.');

  const ids = new Set();
  return input.map((item) => {
    if (!item || typeof item !== 'object') fail('Each project must be an object.');
    const id = text(item.id, 80, 'Id').toLowerCase();
    if (!ID_PATTERN.test(id)) fail('Id must use lowercase letters, numbers, and hyphens.');
    if (ids.has(id)) fail(`Duplicate id: ${id}`);
    ids.add(id);

    const tags = Array.isArray(item.tags) ? item.tags : [];
    if (tags.length > 12) fail('A project can have at most 12 tags.');
    const cleanTags = tags.map((tag, index) => {
      const value = text(tag, 40, `Tag ${index + 1}`);
      if (!value) fail('Tags cannot be empty.');
      return value;
    });

    const locales = Array.isArray(item.locales) ? item.locales.filter((locale) => locale === 'en' || locale === 'tr') : ['en', 'tr'];
    const uniqueLocales = [...new Set(locales)];
    if (!uniqueLocales.length) fail('Choose at least one language.');

    return {
      id,
      image: optionalUrl(item.image, 'Image'),
      link: optionalUrl(item.link, 'Live link'),
      github: optionalUrl(item.github, 'GitHub link'),
      placeholder: Boolean(item.placeholder),
      locales: uniqueLocales,
      tags: cleanTags,
      en: localeBlock(item.en, 'English', uniqueLocales.includes('en')),
      tr: localeBlock(item.tr, 'Turkish', uniqueLocales.includes('tr')),
    };
  });
}

const IMAGE_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export function validateImageUpload({ filename, type, data }) {
  const ext = IMAGE_TYPES[type];
  if (!ext) fail('Image must be PNG, JPG, WEBP, or GIF.');
  if (typeof data !== 'string' || !data) fail('Image data is missing.');
  const buffer = Buffer.from(data, 'base64');
  if (!buffer.length) fail('Image data is empty.');
  if (buffer.length > 2_500_000) fail('Image must be 2.5 MB or smaller.');
  const base = text(filename, 80, 'Filename')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const name = `${base || 'project'}-${Date.now()}.${ext}`;
  return { name, buffer };
}
