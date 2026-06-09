export default {
  meta: {
    title: 'Oğulcan Ismık — Portfolyo',
    description:
      'Oğulcan Ismık portfolyosu — bilgisayar mühendisliği öğrencisi. Projeler, hakkımda, özgeçmiş ve iletişim.',
  },
  site: {
    name: 'Oğulcan Ismık',
    role: '// bilgisayar mühendisliği öğrencisi',
  },
  ui: {
    scroll: 'kaydır',
    backToMenu: '↑ menüye dön',
    themeToLight: 'Açık moda geç',
    themeToDark: 'Koyu moda geç',
    menu: {
      projects: 'Projeler',
      about: 'Hakkımda',
      cv: 'Özgeçmiş',
      contact: 'İletişim',
    },
    panels: {
      projectsLabel: '// projeler',
      projectsTitle: 'Seçilmiş Çalışmalar',
      aboutLabel: '// hakkımda',
      aboutTitle: 'Hakkımda',
      interestsLabel: '// ilgi alanları',
      cvLabel: '// özgeçmiş',
      cvTitle: 'Özgeçmiş',
      cvDownload: '↓ pdf indir',
      experience: 'Deneyim',
      education: 'Eğitim',
      skills: 'Yetenekler',
      contactLabel: '// iletişim',
      contactTitle: 'İletişime Geç',
      formName: 'İsim',
      formEmail: 'E-posta',
      formMessage: 'Mesaj',
      formNamePlaceholder: 'Adınız',
      formEmailPlaceholder: 'siz@ornek.com',
      formMessagePlaceholder: 'Mesajınız...',
      comingSoon: 'yakında',
    },
    links: {
      live: 'canlı →',
      github: 'github →',
    },
    social: {
      phone: 'Telefon',
    },
  },
  about: {
    initials: 'OI',
    bio: 'Yeditepe Üniversitesi Bilgisayar Mühendisliği öğrencisi; şu anda Fransa UTBM\'de Erasmus+ değişim programında. MaviPiksel ve DringAI stajlarında yazılım mühendisliği deneyimi; Flutter, yapay zeka agent iş akışları ve oyun geliştirme alanlarında uygulamalı çalışmalar. Oyun Geliştirme ve Animasyon Kulübü\'nü kurdu ve 12 kişilik ekibi yönetti. Çekirdek seviyesinde C\'den mobil uygulamalara ve arcade oyunlara kadar sistemler inşa etmeye tutkulu.',
    skills: ['Java', 'C / C++', 'C#', 'Python', 'Dart', 'SQL', 'Flutter', 'Unity', 'Git'],
    interests: [
      'TTRPG & Hikâye Anlatımı',
      'Strateji Oyunları',
      'IoT (Arduino & ESP)',
      'Temiz Enerji',
      'Dünya & Sanat Tarihi',
    ],
  },
  projects: [
    {
      id: 'keep-the-power-up',
      title: 'Keep The Power Up',
      description:
        '48 saatlik Startgate Game Jam\'inde (Aralık 2025) çok disiplinli bir ikilide tek programcı olarak geliştirilen arcade yönetim oyunu. Unity\'de oyun mekaniği ve arayüz sistemleri tasarlandı. Elemeyi geçerek en iyi girişler arasında yer aldı.',
      tags: ['unity', 'c#', 'game jam'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'price-scraper',
      title: '3D Yazıcı Fiyat Takipçisi',
      description:
        'Kişisel kullanım için birden fazla e-ticaret platformundaki gerçek zamanlı fiyatları izleyen devam eden bir web kazıma sistemi. Playwright, SQLite ve GitHub Actions ile otomatikleştirildi.',
      tags: ['python', 'playwright', 'sqlite', 'github actions'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'barcode-reader',
      title: 'Barkod Okuyucu: Fiyat Karşılaştırma Uygulaması',
      description:
        'Barkod taramasıyla tüketici ürünlerini tanımlayan Android uygulaması. SerpApi üzerinden Google Shopping entegrasyonu ile birden fazla online perakendeciden gerçek zamanlı fiyat ve mağaza bilgisi toplar.',
      tags: ['java', 'android studio', 'serpapi'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'tetris-engine',
      title: 'Klasik Tetris Motoru',
      description:
        'Harici kütüphane kullanmadan saf C ile yazılmış, verimli oyun döngüsü, gerçek zamanlı kullanıcı girişi ve çarpışma algılama algoritmalarına sahip tam işlevsel konsol Tetris oyunu.',
      tags: ['c'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'linux-scheduler',
      title: 'Linux Çekirdek Modifikasyonu',
      description:
        'Süreç önceliklendirme algoritması olarak Lottery Scheduler uygulamak için Linux 2.4 çekirdeği modifiye edildi. Çekirdek seviyesinde süreç durumlarını yönetmek ve izlemek için yeni bir sistem çağrısı entegre edildi.',
      tags: ['c', 'linux'],
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'attendance-dice',
      title: 'Yoklama Takip & TTRPG Zar Motoru',
      description:
        'MaviPiksel stajında Flutter ve Dart kullanılarak geliştirildi — profesyonel ortamda frontend entegrasyonlu yoklama takip sistemi ve TTRPG zar motoru.',
      tags: ['flutter', 'dart'],
      github: 'https://github.com/ogulcanismik',
    },
  ],
  resume: {
    pdfUrl: '/assets/cv/resume.pdf',
    experience: [
      {
        role: 'Yazılım Mühendisliği Stajyeri',
        company: 'DringAI',
        period: 'Ağu 2025 — Eyl 2025',
        description:
          'Yapay zeka agent iş akışları ve otonom yazılım çözümlerinin geliştirilmesini gözlemledi ve analiz etti.',
      },
      {
        role: 'Kurucu & Eş Başkan',
        company: 'Oyun Geliştirme ve Animasyon Kulübü, Yeditepe Üniversitesi',
        period: 'Eyl 2023 — Şub 2025',
        description:
          '12 kişilik ekibe öncülük etti; organizasyonel strateji, bütçeleme, bölümler arası iletişim ve grafik tasarım yönetimi.',
      },
      {
        role: 'Yazılım Mühendisliği Stajyeri',
        company: 'MaviPiksel İnternet Çözümleri',
        period: 'Tem 2024 — Ağu 2024',
        description:
          'Flutter ve Dart kullanarak frontend geliştirme deneyimi kazandı. Yoklama Takip Sistemi ve TTRPG Zar Motoru geliştirdi.',
      },
    ],
    education: [
      {
        degree: 'Erasmus+ Değişim Programı',
        school: 'Université de Technologie de Belfort-Montbéliard, Fransa',
        period: 'Şub 2025 — Haz 2025',
      },
      {
        degree: 'Bilgisayar Mühendisliği Lisans',
        school: 'Yeditepe Üniversitesi, İstanbul',
        period: 'Eyl 2022 — Devam Ediyor',
      },
      {
        degree: 'Lise Diploması',
        school: 'İzmir Atatürk Lisesi',
        period: 'Eyl 2018 — Haz 2021',
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
      'İngilizce (C1)',
      'Fransızca (A2)',
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
