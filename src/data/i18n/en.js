export default {
  meta: {
    title: 'Oğulcan Ismık — Portfolio',
    description:
      'Portfolio of Oğulcan Ismık — new grad in computer engineering, focused on game programming with Unity, C#, and TTRPG tools.',
  },
  site: {
    name: 'Oğulcan Ismık',
    initials: 'OI',
    role: '// new grad · game programming',
  },
  ui: {
    scroll: 'descend',
    backToMenu: '↑ return to menu',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    menu: {
      projects: 'Creations',
      about: 'About Me',
      cv: 'CV',
      contact: 'Contact',
    },
    panels: {
      projectsLabel: '// creations',
      projectsTitle: 'Creations',
      aboutLabel: '// about',
      aboutTitle: 'About Me',
      interestsLabel: '// interests',
      statClass: 'Class',
      statBackground: 'Background',
      statAlignment: 'Alignment',
      cvLabel: '// cv',
      cvTitle: 'Curriculum Vitae',
      cvDownload: '↓ download pdf',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      contactLabel: '// summon',
      contactTitle: 'Summon Me',
      formName: 'Name',
      formEmail: 'Email',
      formMessage: 'Message',
      formNamePlaceholder: 'Your name',
      formEmailPlaceholder: 'you@example.com',
      formMessagePlaceholder: 'Your message...',
      comingSoon: 'coming soon',
    },
    links: {
      live: 'live →',
      github: 'github →',
    },
    social: {
      phone: 'Phone',
    },
  },
  about: {
    initials: 'OI',
    class: 'Aspiring Game Programmer',
    background: 'TTRPG & Systems',
    alignment: 'Lawful Creative',
    bio: 'I build mechanics, tools, and worlds in Unity and C#. Sole programmer on a qualifying Startgate Game Jam entry. Built a TTRPG dice engine during my MaviPiksel internship. Founded and co-led the Game Development & Animation Club — a team of 12. Computer Engineering graduate from Yeditepe University, with Erasmus+ experience at UTBM in France. When not working on games, I design tabletop systems and low-level experiments in C.',
    skills: ['Unity', 'C#', 'C / C++', 'Git', 'Flutter', 'Dart', 'Python', 'Java', 'SQL'],
    interests: [
      'TTRPG & Storytelling',
      'Strategy Games',
      'IoT (Arduino & ESP)',
      'Clean Energy',
      'World & Art History',
    ],
  },
  projects: [
    {
      id: 'keep-the-power-up',
      title: 'Keep The Power Up',
      description:
        'Arcade management game built as sole programmer in a multidisciplinary duo during the 48-hour Startgate Game Jam (December 2025). Designed game mechanics and UI systems in Unity. Qualified and ranked among the top entries.',
      tags: ['unity', 'c#', 'game jam'],
      questMeta: { status: 'Shipped', type: 'Game' },
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'game-placeholder-1',
      title: 'Untitled Game Project',
      description: 'Placeholder — game project details coming soon.',
      tags: ['unity', 'c#'],
      questMeta: { status: 'In Development', type: 'Game' },
      github: 'https://github.com/ogulcanismik',
      placeholder: true,
    },
    {
      id: 'game-placeholder-2',
      title: 'Dungeon Crawler Prototype',
      description: 'Placeholder — procedural dungeon crawler in early development.',
      tags: ['unity', 'procedural generation'],
      questMeta: { status: 'In Development', type: 'Game' },
      github: 'https://github.com/ogulcanismik',
      placeholder: true,
    },
    {
      id: 'attendance-dice',
      title: 'Attendance Tracker & TTRPG Dice Engine',
      description:
        'Built during internship at MaviPiksel using Flutter and Dart — an attendance tracking system and a TTRPG dice engine with frontend integration in a professional environment.',
      tags: ['flutter', 'dart', 'ttrpg'],
      questMeta: { status: 'Shipped', type: 'Tool' },
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'tetris-engine',
      title: 'Classic Tetris Engine',
      description:
        'Fully functional console Tetris game in pure C with efficient game loop logic, real-time user input handling, and collision detection — no external libraries.',
      tags: ['c'],
      questMeta: { status: 'Shipped', type: 'Game' },
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'price-scraper',
      title: '3D Printer Price Scraper & Tracker',
      description:
        'Ongoing web scraping system that monitors real-time pricing across multiple e-commerce platforms for personal use. Built with Playwright, SQLite, and automated via GitHub Actions.',
      tags: ['python', 'playwright', 'sqlite', 'github actions'],
      questMeta: { status: 'Ongoing', type: 'Tool' },
      github: 'https://github.com/ogulcanismik',
    },
    // {
    //   id: 'barcode-reader',
    //   title: 'Barcode Reader: Price Comparison App',
    //   description:
    //     'Android app that identifies consumer products via barcode scanning. Integrates Google Shopping through SerpApi to aggregate real-time pricing and store details from multiple online retailers.',
    //   tags: ['java', 'android studio', 'serpapi'],
    //   github: 'https://github.com/ogulcanismik',
    // },
    // {
    //   id: 'linux-scheduler',
    //   title: 'Linux Kernel Modification',
    //   description:
    //     'Modified the Linux 2.4 kernel to implement a Lottery Scheduler as a process prioritization algorithm. Integrated a new system call to manage and monitor process states at the kernel level.',
    //   tags: ['c', 'linux'],
    //   github: 'https://github.com/ogulcanismik',
    // },
  ],
  resume: {
    pdfUrl: '/assets/cv/resume.pdf',
    experience: [
      {
        role: 'Software Engineering Intern',
        company: 'DringAI',
        period: 'Aug 2025 — Sep 2025',
        description:
          'Observed and analyzed the development of AI agentic workflows and autonomous software solutions.',
      },
      {
        role: 'Founder & Co-President',
        company: 'Game Development & Animation Club, Yeditepe University',
        period: 'Sep 2023 — Feb 2025',
        description:
          'Spearheaded a team of 12, managing organizational strategy, budgeting, cross-departmental communication, and graphic design.',
      },
      {
        role: 'Software Engineering Intern',
        company: 'MaviPiksel İnternet Çözümleri',
        period: 'Jul 2024 — Aug 2024',
        description:
          'Gained hands-on experience in frontend development using Flutter and Dart. Developed an Attendance Tracking System and a TTRPG Dice Engine.',
      },
    ],
    education: [
      {
        degree: 'Erasmus+ Exchange Program',
        school: 'Université de Technologie de Belfort-Montbéliard, France',
        period: 'Feb 2025 — Jun 2025',
      },
      {
        degree: 'B.S. Computer Engineering',
        school: 'Yeditepe University, Istanbul',
        period: 'Sep 2022 — Present',
      },
      {
        degree: 'High School Diploma',
        school: 'İzmir Atatürk Lisesi',
        period: 'Sep 2018 — Jun 2021',
      },
    ],
    skills: [
      'Java',
      'C / C++',
      'C#',
      'Python',
      'Dart',
      'SQL',
      'Flutter',
      'Unity',
      'Android Studio',
      'Git',
      'Playwright',
      'Power BI',
      'English (C1)',
      'French (A2)',
    ],
  },
  contact: {
    email: 'ogulcan.ismik@std.yeditepe.edu.tr',
    location: 'Ataşehir, İstanbul',
    phone: '+90 539 322 26 53',
    socials: [
      {
        label: 'GitHub',
        url: 'https://github.com/ogulcanismik',
        handle: '@ogulcanismik',
      },
      {
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/ogulcanismik',
        handle: '/in/ogulcanismik',
      },
      {
        labelKey: 'phone',
        url: 'tel:+905393222653',
        handle: '+90 539 322 26 53',
      },
    ],
  },
};
