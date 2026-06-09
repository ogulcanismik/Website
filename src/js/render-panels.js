import { getContent, resolveSocialLabel } from './i18n.js';

function renderQuestMeta(p) {
  if (!p.questMeta) return '';
  const { status, type } = p.questMeta;
  return `<p class="project-card__meta">// ${status} · ${type}</p>`;
}

function renderProjects(content) {
  const { ui, projects } = content;
  return `
    <div class="panel__inner">
      <p class="section-label">${ui.panels.projectsLabel}</p>
      <h2 class="panel__title">${ui.panels.projectsTitle}</h2>
      ${projects
        .map(
          (p) => `
        <article class="project-card${p.placeholder ? ' project-card--placeholder' : ''}" id="${p.id}">
          ${renderQuestMeta(p)}
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__description">${p.description}</p>
          <div class="project-card__tags">
            ${p.tags.map((tag) => `<span class="project-card__tag">${tag}</span>`).join('')}
          </div>
          <div class="project-card__links">
            ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">${ui.links.live}</a>` : ''}
            ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer">${ui.links.github}</a>` : ''}
          </div>
        </article>
      `
        )
        .join('')}
    </div>
  `;
}

function renderAbout(content) {
  const { ui, about } = content;
  return `
    <div class="panel__inner">
      <p class="section-label">${ui.panels.aboutLabel}</p>
      <h2 class="panel__title">${ui.panels.aboutTitle}</h2>
      <div class="about">
        <div class="about__header">
          <div class="about__avatar">${about.initials}</div>
          <div class="stat-block">
            <div class="stat-block__row">
              <span class="stat-block__label">${ui.panels.statClass}</span>
              <span class="stat-block__value">${about.class}</span>
            </div>
            <div class="stat-block__row">
              <span class="stat-block__label">${ui.panels.statBackground}</span>
              <span class="stat-block__value">${about.background}</span>
            </div>
            <div class="stat-block__row">
              <span class="stat-block__label">${ui.panels.statAlignment}</span>
              <span class="stat-block__value">${about.alignment}</span>
            </div>
          </div>
        </div>
        <p class="about__bio">${about.bio}</p>
        <div class="about__skills">
          ${about.skills.map((s) => `<span class="about__skill">${s}</span>`).join('')}
        </div>
        ${
          about.interests?.length
            ? `<div class="about__interests">
          <p class="section-label">${ui.panels.interestsLabel}</p>
          <div class="about__skills">
            ${about.interests.map((i) => `<span class="about__skill">${i}</span>`).join('')}
          </div>
        </div>`
            : ''
        }
      </div>
    </div>
  `;
}

function renderCV(content) {
  const { ui, resume } = content;
  return `
    <div class="panel__inner">
      <p class="section-label">${ui.panels.cvLabel}</p>
      <h2 class="panel__title">${ui.panels.cvTitle}</h2>
      <a class="cv__download" href="${resume.pdfUrl}" download>
        ${ui.panels.cvDownload}
      </a>
      <div class="cv__section">
        <h3 class="cv__section-title">${ui.panels.experience}</h3>
        ${resume.experience
          .map(
            (e) => `
          <div class="cv__entry">
            <div class="cv__entry-header">
              <span class="cv__entry-role">${e.role}</span>
              <span class="cv__entry-period">${e.period}</span>
            </div>
            <div class="cv__entry-company">${e.company}</div>
            <p class="cv__entry-desc">${e.description}</p>
          </div>
        `
          )
          .join('')}
      </div>
      <div class="cv__section">
        <h3 class="cv__section-title">${ui.panels.education}</h3>
        ${resume.education
          .map(
            (e) => `
          <div class="cv__entry">
            <div class="cv__entry-header">
              <span class="cv__entry-role">${e.degree}</span>
              <span class="cv__entry-period">${e.period}</span>
            </div>
            <div class="cv__entry-company">${e.school}</div>
          </div>
        `
          )
          .join('')}
      </div>
      <div class="cv__section">
        <h3 class="cv__section-title">${ui.panels.skills}</h3>
        <div class="cv__skills">
          ${resume.skills.map((s) => `<span class="cv__skill">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderContact(content) {
  const { ui, contact } = content;
  return `
    <div class="panel__inner">
      <p class="section-label">${ui.panels.contactLabel}</p>
      <h2 class="panel__title">${ui.panels.contactTitle}</h2>
      <a class="contact__email" href="mailto:${contact.email}">${contact.email}</a>
      ${contact.location ? `<p class="contact__location mono">${contact.location}</p>` : ''}
      <div class="contact__socials">
        ${contact.socials
          .map(
            (s) => `
          <a class="contact__social" href="${s.url}" target="_blank" rel="noopener noreferrer">
            <span class="contact__social-label">${resolveSocialLabel(s, ui)}</span>
            <span class="contact__social-handle">${s.handle}</span>
          </a>
        `
          )
          .join('')}
      </div>
      <form class="contact__form" onsubmit="return false;">
        <div class="contact__field">
          <label for="contact-name">${ui.panels.formName}</label>
          <input type="text" id="contact-name" name="name" placeholder="${ui.panels.formNamePlaceholder}" disabled />
        </div>
        <div class="contact__field">
          <label for="contact-email">${ui.panels.formEmail}</label>
          <input type="email" id="contact-email" name="email" placeholder="${ui.panels.formEmailPlaceholder}" disabled />
        </div>
        <div class="contact__field">
          <label for="contact-message">${ui.panels.formMessage}</label>
          <textarea id="contact-message" name="message" placeholder="${ui.panels.formMessagePlaceholder}" disabled></textarea>
        </div>
        <button type="submit" class="contact__submit" disabled>${ui.panels.comingSoon}</button>
      </form>
    </div>
  `;
}

const panelRenderers = {
  projects: renderProjects,
  about: renderAbout,
  cv: renderCV,
  contact: renderContact,
};

export function renderPanels(container) {
  const content = getContent();

  Object.entries(panelRenderers).forEach(([id, render]) => {
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = `panel-${id}`;
    panel.dataset.panel = id;
    panel.innerHTML = render(content);
    container.appendChild(panel);
  });
}

export function rerenderPanels(container) {
  container.innerHTML = '';
  renderPanels(container);
}
