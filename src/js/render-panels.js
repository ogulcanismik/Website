import { projects } from '../data/projects.js';
import { about } from '../data/about.js';
import { resume } from '../data/resume.js';
import { contact } from '../data/contact.js';

function renderProjects() {
  return `
    <div class="panel__inner">
      <p class="section-label">// projects</p>
      <h2 class="panel__title">Selected Work</h2>
      ${projects
        .map(
          (p) => `
        <article class="project-card" id="${p.id}">
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__description">${p.description}</p>
          <div class="project-card__tags">
            ${p.tags.map((tag) => `<span class="project-card__tag">${tag}</span>`).join('')}
          </div>
          <div class="project-card__links">
            ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">live →</a>` : ''}
            ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer">github →</a>` : ''}
          </div>
        </article>
      `
        )
        .join('')}
    </div>
  `;
}

function renderAbout() {
  return `
    <div class="panel__inner">
      <p class="section-label">// about</p>
      <h2 class="panel__title">About Me</h2>
      <div class="about">
        <div class="about__avatar">${about.initials}</div>
        <p class="about__bio">${about.bio}</p>
        <div class="about__skills">
          ${about.skills.map((s) => `<span class="about__skill">${s}</span>`).join('')}
        </div>
        ${
          about.interests?.length
            ? `<div class="about__interests">
          <p class="section-label">// interests</p>
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

function renderCV() {
  return `
    <div class="panel__inner">
      <p class="section-label">// cv</p>
      <h2 class="panel__title">Curriculum Vitae</h2>
      <a class="cv__download" href="${resume.pdfUrl}" download>
        ↓ download pdf
      </a>
      <div class="cv__section">
        <h3 class="cv__section-title">Experience</h3>
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
        <h3 class="cv__section-title">Education</h3>
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
        <h3 class="cv__section-title">Skills</h3>
        <div class="cv__skills">
          ${resume.skills.map((s) => `<span class="cv__skill">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderContact() {
  return `
    <div class="panel__inner">
      <p class="section-label">// contact</p>
      <h2 class="panel__title">Get in Touch</h2>
      <a class="contact__email" href="mailto:${contact.email}">${contact.email}</a>
      ${contact.location ? `<p class="contact__location mono">${contact.location}</p>` : ''}
      <div class="contact__socials">
        ${contact.socials
          .map(
            (s) => `
          <a class="contact__social" href="${s.url}" target="_blank" rel="noopener noreferrer">
            <span class="contact__social-label">${s.label}</span>
            <span class="contact__social-handle">${s.handle}</span>
          </a>
        `
          )
          .join('')}
      </div>
      <form class="contact__form" onsubmit="return false;">
        <div class="contact__field">
          <label for="contact-name">Name</label>
          <input type="text" id="contact-name" name="name" placeholder="Your name" disabled />
        </div>
        <div class="contact__field">
          <label for="contact-email">Email</label>
          <input type="email" id="contact-email" name="email" placeholder="you@example.com" disabled />
        </div>
        <div class="contact__field">
          <label for="contact-message">Message</label>
          <textarea id="contact-message" name="message" placeholder="Your message..." disabled></textarea>
        </div>
        <button type="submit" class="contact__submit" disabled>coming soon</button>
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
  Object.entries(panelRenderers).forEach(([id, render]) => {
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = `panel-${id}`;
    panel.dataset.panel = id;
    panel.innerHTML = render();
    container.appendChild(panel);
  });
}
