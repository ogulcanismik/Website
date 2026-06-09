export default {
  meta: {
    title: 'Oğulcan Ismık — Portfolio',
    description:
      'Portfolio of Oğulcan Ismık — computer engineering student. Projects, about, CV, and contact.',
  },
  site: {
    name: 'Oğulcan Ismık',
    role: '// computer engineering student',
  },
  ui: {
    scroll: 'scroll',
    backToMenu: '↑ back to menu',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    menu: {
      projects: 'Projects',
      about: 'About Me',
      cv: 'CV',
      contact: 'Contact',
    },
    panels: {
      projectsLabel: '// projects',
      projectsTitle: 'Selected Work',
      aboutLabel: '// about',
      aboutTitle: 'About Me',
      interestsLabel: '// interests',
      cvLabel: '// cv',
      cvTitle: 'Curriculum Vitae',
      cvDownload: '↓ download pdf',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      contactLabel: '// contact',
      contactTitle: 'Get in Touch',
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
    bio: 'Computer Engineering student at Yeditepe University, currently on an Erasmus+ exchange at UTBM in France. Experienced in software engineering internships at MaviPiksel and DringAI, with hands-on work in Flutter, AI agent workflows, and game development. Founded and co-led the Game Development & Animation Club, managing a team of 12. Passionate about building systems — from kernel-level C to mobile apps and arcade games.',
    skills: ['Java', 'C / C++', 'C#', 'Python', 'Dart', 'SQL', 'Flutter', 'Unity', 'Git'],
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
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'price-scraper',
      title: '3D Printer Price Scraper & Tracker',
      description:
        'Ongoing web scraping system that monitors real-time pricing across multiple e-commerce platforms for personal use. Built with Playwright, SQLite, and automated via GitHub Actions.',
      tags: ['python', 'playwright', 'sqlite', 'github actions'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'barcode-reader',
      title: 'Barcode Reader: Price Comparison App',
      description:
        'Android app that identifies consumer products via barcode scanning. Integrates Google Shopping through SerpApi to aggregate real-time pricing and store details from multiple online retailers.',
      tags: ['java', 'android studio', 'serpapi'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'tetris-engine',
      title: 'Classic Tetris Engine',
      description:
        'Fully functional console Tetris game in pure C with efficient game loop logic, real-time user input handling, and collision detection — no external libraries.',
      tags: ['c'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'linux-scheduler',
      title: 'Linux Kernel Modification',
      description:
        'Modified the Linux 2.4 kernel to implement a Lottery Scheduler as a process prioritization algorithm. Integrated a new system call to manage and monitor process states at the kernel level.',
      tags: ['c', 'linux'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'attendance-dice',
      title: 'Attendance Tracker & TTRPG Dice Engine',
      description:
        'Built during internship at MaviPiksel using Flutter and Dart — an attendance tracking system and a TTRPG dice engine with frontend integration in a professional environment.',
      tags: ['flutter', 'dart'],
      github: 'https://github.com/ogulcanismik',
    },
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
