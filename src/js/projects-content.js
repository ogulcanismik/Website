export function projectsForLocale(list, locale) {
  const lang = locale === 'tr' ? 'tr' : 'en';

  return list.flatMap((project) => {
    const locales = project.locales?.length ? project.locales : ['en', 'tr'];
    if (!locales.includes(lang)) return [];

    const copy = project[lang]?.title ? project[lang] : project.en;
    const fallback = project.en;
    const card = {
      id: project.id,
      title: copy.title || fallback.title,
      description: copy.description || fallback.description,
      tags: project.tags,
      questMeta: {
        status: copy.status || fallback.status,
        type: copy.type || fallback.type,
      },
      placeholder: Boolean(project.placeholder),
    };

    if (project.image) card.image = project.image;
    if (project.link) card.link = project.link;
    if (project.github) card.github = project.github;
    return [card];
  });
}
