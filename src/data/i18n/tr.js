export default {
  meta: {
    title: 'Oğulcan Ismık — Portfolyo',
    description:
      'Oğulcan Ismık portfolyosu — bilgisayar mühendisliği yeni mezunu, Unity, C# ve TTRPG araçlarına odaklı oyun programlama.',
    url: 'https://ogulcanismik.com/',
  },
  site: {
    name: 'Oğulcan Ismık',
    initials: 'OI',
    role: '// yeni mezun · oyun programlama',
  },
  ui: {
    scroll: 'iniş',
    backToMenu: '↑ menüye dön',
    themeToLight: 'Açık moda geç',
    themeToDark: 'Koyu moda geç',
    menu: {
      projects: 'Eserler',
      about: 'Hakkımda',
      cv: 'Özgeçmiş',
      contact: 'İletişim',
    },
    panels: {
      projectsLabel: '// eserler',
      projectsTitle: 'Eserler',
      aboutLabel: '// hakkımda',
      aboutTitle: 'Hakkımda',
      interestsLabel: '// ilgi alanları',
      statClass: 'Sınıf',
      statBackground: 'Geçmiş',
      statAlignment: 'Hizalanma',
      cvLabel: '// özgeçmiş',
      cvTitle: 'Özgeçmiş',
      cvDownload: '↓ pdf indir',
      experience: 'Deneyim',
      education: 'Eğitim',
      skills: 'Yetenekler',
      contactLabel: '// çağır',
      contactTitle: 'Beni Çağır',
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
    class: 'Hevesli Oyun Programcısı',
    background: 'TTRPG & Sistemler',
    alignment: 'Düzenli Yaratıcı',
    bio: 'Unity ve C# ile mekanik, araç ve dünyalar inşa ediyorum. Startgate Game Jam\'de elemeyi geçen girişin tek programcısıydım. MaviPiksel stajında TTRPG zar motoru geliştirdim. 12 kişilik Oyun Geliştirme ve Animasyon Kulübü\'nü kurdu ve yönettim. Yeditepe Üniversitesi Bilgisayar Mühendisliği mezunuyum; Fransa UTBM\'de Erasmus+ deneyimim var. Oyunların dışında masaüstü sistemler ve C ile düşük seviye deneyler tasarlıyorum.',
    skills: ['Unity', 'C#', 'C / C++', 'Git', 'Flutter', 'Dart', 'Python', 'Java', 'SQL'],
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
      questMeta: { status: 'Yayınlandı', type: 'Oyun' },
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'game-placeholder-1',
      title: 'İsimsiz Oyun Projesi',
      description: 'Yer tutucu — oyun projesi detayları yakında eklenecek.',
      tags: ['unity', 'c#'],
      questMeta: { status: 'Geliştiriliyor', type: 'Oyun' },
      github: 'https://github.com/ogulcanismik',
      placeholder: true,
    },
    {
      id: 'game-placeholder-2',
      title: 'Zindan Gezgini Prototipi',
      description: 'Yer tutucu — prosedürel zindan gezgini erken geliştirme aşamasında.',
      tags: ['unity', 'procedural generation'],
      questMeta: { status: 'Geliştiriliyor', type: 'Oyun' },
      github: 'https://github.com/ogulcanismik',
      placeholder: true,
    },
    {
      id: 'attendance-dice',
      title: 'Yoklama Takip & TTRPG Zar Motoru',
      description:
        'MaviPiksel stajında Flutter ve Dart kullanılarak geliştirildi — profesyonel ortamda frontend entegrasyonlu yoklama takip sistemi ve TTRPG zar motoru.',
      tags: ['flutter', 'dart', 'ttrpg'],
      questMeta: { status: 'Yayınlandı', type: 'Araç' },
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'tetris-engine',
      title: 'Klasik Tetris Motoru',
      description:
        'Harici kütüphane kullanmadan saf C ile yazılmış, verimli oyun döngüsü, gerçek zamanlı kullanıcı girişi ve çarpışma algılama algoritmalarına sahip tam işlevsel konsol Tetris oyunu.',
      tags: ['c'],
      questMeta: { status: 'Yayınlandı', type: 'Oyun' },
      github: 'https://github.com/ogulcanismik',
    },
    {
      id: 'price-scraper',
      title: '3D Yazıcı Fiyat Takipçisi',
      description:
        'Kişisel kullanım için birden fazla e-ticaret platformundaki gerçek zamanlı fiyatları izleyen devam eden bir web kazıma sistemi. Playwright, SQLite ve GitHub Actions ile otomatikleştirildi.',
      tags: ['python', 'playwright', 'sqlite', 'github actions'],
      questMeta: { status: 'Devam Ediyor', type: 'Araç' },
      github: 'https://github.com/ogulcanismik',
    },
    // {
    //   id: 'barcode-reader',
    //   title: 'Barkod Okuyucu: Fiyat Karşılaştırma Uygulaması',
    //   description:
    //     'Barkod taramasıyla tüketici ürünlerini tanımlayan Android uygulaması. SerpApi üzerinden Google Shopping entegrasyonu ile birden fazla online perakendeciden gerçek zamanlı fiyat ve mağaza bilgisi toplar.',
    //   tags: ['java', 'android studio', 'serpapi'],
    //   github: 'https://github.com/ogulcanismik',
    // },
    // {
    //   id: 'linux-scheduler',
    //   title: 'Linux Çekirdek Modifikasyonu',
    //   description:
    //     'Süreç önceliklendirme algoritması olarak Lottery Scheduler uygulamak için Linux 2.4 çekirdeği modifiye edildi. Çekirdek seviyesinde süreç durumlarını yönetmek ve izlemek için yeni bir sistem çağrısı entegre edildi.',
    //   tags: ['c', 'linux'],
    //   github: 'https://github.com/ogulcanismik',
    // },
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
