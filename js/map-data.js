// FMV Ispartakule Işık Okulları - Konum Verileri
// Kaynak: Okul tahliye planları + FMV resmi bilgileri
// 3 katlı bina + bodrum kat, 21.000 m² kapalı alan

const LOCATIONS = [
  // =================== YONETIM (Zemin Kat) ===================
  {
    id: 'mudur', name: 'Müdür Odası', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '👤',
    x: 130, y: 95, w: 100, h: 55,
    description: 'Okul Müdürü makam odası. Ziyaretçi ve veli görüşmeleri randevu ile yapılır.',
    directions: [
      'Ana girişten binaya girin',
      'Resepsiyonda sola dönün',
      'Yönetim koridorunda düz ilerleyin',
      'İlk kapı sol tarafta — Müdür Odası'
    ],
    info: 'Çalışma Saatleri: 08:30 - 17:00'
  },
  {
    id: 'mudur_yrd_1', name: 'Müdür Yardımcısı 1', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '👥',
    x: 130, y: 158, w: 100, h: 50,
    description: 'Müdür Yardımcısı — Öğrenci işleri, devamsızlık ve disiplin konuları.',
    directions: [
      'Ana girişten binaya girin',
      'Resepsiyonda sola dönün',
      'Müdür odasını geçin',
      'Hemen yanındaki kapı — Müdür Yardımcısı 1'
    ],
    info: 'Çalışma Saatleri: 08:00 - 17:00'
  },
  {
    id: 'mudur_yrd_2', name: 'Müdür Yardımcısı 2', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '👥',
    x: 130, y: 216, w: 100, h: 50,
    description: 'Müdür Yardımcısı — Eğitim-öğretim koordinasyonu ve ders programları.',
    directions: [
      'Ana girişten binaya girin',
      'Resepsiyonda sola dönün',
      'Yönetim koridorunda ilerleyin',
      'Üçüncü kapı — Müdür Yardımcısı 2'
    ],
    info: 'Çalışma Saatleri: 08:00 - 17:00'
  },
  {
    id: 'rehberlik', name: 'Rehberlik Servisi', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '🎯',
    x: 130, y: 274, w: 100, h: 50,
    description: 'Psikolojik danışmanlık ve rehberlik. Öğrenci ve veli görüşmeleri yapılır.',
    directions: [
      'Ana girişten binaya girin',
      'Resepsiyonda sola dönün',
      'Yönetim koridorunun sonuna kadar ilerleyin',
      'Son kapı — Rehberlik Servisi'
    ],
    info: 'Randevu ile görüşme: 08:30 - 16:30'
  },
  {
    id: 'idari_ofis', name: 'İdari İşler / Sekreterlik', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '📋',
    x: 130, y: 340, w: 100, h: 50,
    description: 'Okul sekreterliği. Belge, kayıt ve resmi işlemler.',
    directions: [
      'Ana girişten binaya girin',
      'Resepsiyonun hemen sağında İdari İşler ofisi',
      'Kapıda "Sekreterlik" yazısı bulunur'
    ],
    info: 'Hafta içi 08:30 - 17:00'
  },

  // =================== OGRETMEN ===================
  {
    id: 'ogretmenler_odasi', name: 'Öğretmenler Odası', category: 'ogretmen', floor: 1,
    color: '#2e7d32', icon: '📚',
    x: 130, y: 95, w: 140, h: 70,
    description: 'Öğretmenler odası. Teneffüs saatlerinde öğretmenlerle görüşme yapılabilir.',
    directions: [
      'Ana girişten binaya girin',
      'Ana merdivenden 1. kata çıkın',
      'Merdiven çıkışında sola dönün',
      'Koridorda ilerleyin — sol tarafta geniş kapılı Öğretmenler Odası'
    ],
    info: 'Teneffüs saatlerinde ziyaret edilebilir'
  },
  {
    id: 'ogretmen_calisma', name: 'Öğretmen Çalışma Odası', category: 'ogretmen', floor: 1,
    color: '#2e7d32', icon: '✏️',
    x: 130, y: 173, w: 140, h: 50,
    description: 'Öğretmenlerin ders hazırlığı yaptığı çalışma alanı.',
    directions: [
      'Ana merdivenden 1. kata çıkın',
      'Sola dönün',
      'Öğretmenler Odasını geçin',
      'Hemen yanındaki oda — Öğretmen Çalışma Odası'
    ],
    info: 'Sessiz çalışma alanı'
  },

  // =================== TUVALETLER ===================
  {
    id: 'tuvalet_erkek_zemin', name: 'Erkek Tuvalet (Zemin)', category: 'tuvalet', floor: 0,
    color: '#0288d1', icon: '🚹',
    x: 130, y: 430, w: 80, h: 45,
    description: 'Zemin kat erkek tuvaleti.',
    directions: [
      'Ana girişten binaya girin',
      'Sol koridora dönün',
      'Koridorun sonunda merdiven yanında — Erkek WC'
    ],
    info: 'Zemin Kat — Sol Koridor Sonu'
  },
  {
    id: 'tuvalet_kiz_zemin', name: 'Kız Tuvalet (Zemin)', category: 'tuvalet', floor: 0,
    color: '#e91e63', icon: '🚺',
    x: 220, y: 430, w: 80, h: 45,
    description: 'Zemin kat kız tuvaleti.',
    directions: [
      'Ana girişten binaya girin',
      'Sol koridora dönün',
      'Erkek tualetin hemen yanında — Kız WC'
    ],
    info: 'Zemin Kat — Sol Koridor Sonu'
  },
  {
    id: 'tuvalet_erkek_1', name: 'Erkek Tuvalet (1. Kat)', category: 'tuvalet', floor: 1,
    color: '#0288d1', icon: '🚹',
    x: 130, y: 430, w: 80, h: 45,
    description: '1. kat erkek tuvaleti.',
    directions: [
      'Merdivenden 1. kata çıkın',
      'Sol koridorun sonuna ilerleyin',
      'Merdiven yanında — Erkek WC'
    ],
    info: '1. Kat — Sol Koridor Sonu'
  },
  {
    id: 'tuvalet_kiz_1', name: 'Kız Tuvalet (1. Kat)', category: 'tuvalet', floor: 1,
    color: '#e91e63', icon: '🚺',
    x: 220, y: 430, w: 80, h: 45,
    description: '1. kat kız tuvaleti.',
    directions: [
      'Merdivenden 1. kata çıkın',
      'Sol koridorun sonuna ilerleyin',
      'Erkek tualetin yanında — Kız WC'
    ],
    info: '1. Kat — Sol Koridor Sonu'
  },
  {
    id: 'tuvalet_erkek_2', name: 'Erkek Tuvalet (2. Kat)', category: 'tuvalet', floor: 2,
    color: '#0288d1', icon: '🚹',
    x: 130, y: 430, w: 80, h: 45,
    description: '2. kat erkek tuvaleti.',
    directions: ['Merdivenden 2. kata çıkın', 'Sol koridorun sonuna ilerleyin', 'Merdiven yanında — Erkek WC'],
    info: '2. Kat — Sol Koridor Sonu'
  },
  {
    id: 'tuvalet_kiz_2', name: 'Kız Tuvalet (2. Kat)', category: 'tuvalet', floor: 2,
    color: '#e91e63', icon: '🚺',
    x: 220, y: 430, w: 80, h: 45,
    description: '2. kat kız tuvaleti.',
    directions: ['Merdivenden 2. kata çıkın', 'Sol koridorun sonuna ilerleyin', 'Erkek tualetin yanında — Kız WC'],
    info: '2. Kat — Sol Koridor Sonu'
  },
  {
    id: 'tuvalet_bodrum', name: 'Tuvalet (Bodrum)', category: 'tuvalet', floor: -1,
    color: '#0288d1', icon: '🚻',
    x: 130, y: 410, w: 100, h: 45,
    description: 'Bodrum kat tuvaletleri.',
    directions: ['Merdivenden bodrum kata inin', 'Sağ koridorun sonunda — Tuvaletler'],
    info: 'Bodrum Kat'
  },

  // =================== ORTAK ALANLAR ===================
  {
    id: 'kantin', name: 'Kantin / Yemekhane', category: 'ortak', floor: 0,
    color: '#f57c00', icon: '🍽️',
    x: 560, y: 95, w: 150, h: 80,
    description: 'Okul kantini ve yemekhane. Sıcak yemek, sandviç ve içecek servisi.',
    directions: [
      'Ana girişten binaya girin',
      'Ana koridorda sağa doğru ilerleyin',
      'Koridorun sağ tarafında büyük kapılı Kantin alanı'
    ],
    info: 'Öğle: 12:00-13:00 | Kantin: 08:00-16:00'
  },
  {
    id: 'kutuphane', name: 'Kütüphane', category: 'ortak', floor: 1,
    color: '#f57c00', icon: '📖',
    x: 560, y: 95, w: 150, h: 80,
    description: 'Okul kütüphanesi. Ders çalışma, araştırma ve kitap okuma alanı. Sessiz çalışma bölümü mevcuttur.',
    directions: [
      'Merdivenden 1. kata çıkın',
      'Sağ koridora dönün',
      'Koridorda ilerleyin',
      'Sağ tarafta cam kapılı Kütüphane'
    ],
    info: '08:30 - 16:30 arası açık'
  },
  {
    id: 'amfiteatr', name: 'Amfiteatr / Konferans', category: 'ortak', floor: -1,
    color: '#f57c00', icon: '🎭',
    x: 130, y: 95, w: 200, h: 130,
    description: 'Konferans salonu ve amfitiyatro. Tören, seminer, tiyatro ve sunum etkinlikleri.',
    directions: [
      'Ana girişten binaya girin',
      'Ana merdivenden bodrum kata inin',
      'Merdiven çıkışında sola dönün',
      'Geniş kapılı Amfiteatr girişi karşınızda'
    ],
    info: 'Kapasite: ~250 kişi'
  },
  {
    id: 'spor_salonu', name: 'Spor Salonu', category: 'ortak', floor: -1,
    color: '#f57c00', icon: '🏀',
    x: 450, y: 95, w: 180, h: 120,
    description: 'Kapalı spor salonu. Basketbol, voleybol, badminton ve beden eğitimi dersleri.',
    directions: [
      'Ana merdivenden bodrum kata inin',
      'Sağ koridora dönün',
      'Koridorda düz ilerleyin',
      'Büyük çift kapılı alan — Spor Salonu'
    ],
    info: 'Beden eğitimi dersleri ve kulüp etkinlikleri'
  },
  {
    id: 'yuzme_havuzu', name: 'Yüzme Havuzu', category: 'ortak', floor: -1,
    color: '#0097a7', icon: '🏊',
    x: 650, y: 95, w: 160, h: 120,
    description: 'Yarı olimpik yüzme havuzu. Yüzme dersleri ve antrenmanlar.',
    directions: [
      'Ana merdivenden bodrum kata inin',
      'Sağ koridora dönün',
      'Spor salonunu geçin',
      'Koridorun sonunda — Yüzme Havuzu'
    ],
    info: 'Yüzme dersleri ve antrenmanlar'
  },
  {
    id: 'teneffushane', name: 'Teneffüshane', category: 'ortak', floor: 0,
    color: '#43a047', icon: '☀️',
    x: 760, y: 95, w: 130, h: 310,
    description: 'Açık hava dinlenme ve teneffüs alanı. Bahçe ve oturma grupları mevcuttur.',
    directions: [
      'Ana koridorda en sağa ilerleyin',
      'Koridorun sonundaki cam kapıdan dışarı çıkın',
      'Teneffüshane açık alandadır'
    ],
    info: 'Teneffüs saatlerinde kullanılabilir'
  },
  {
    id: 'atolye', name: 'Atölye / Sanat Odası', category: 'ortak', floor: -1,
    color: '#f57c00', icon: '🎨',
    x: 350, y: 95, w: 90, h: 80,
    description: 'Görsel sanatlar atölyesi. Resim, seramik ve tasarım çalışmaları.',
    directions: [
      'Merdivenden bodrum kata inin',
      'Sola dönün, amfiteatrı geçin',
      'Sağ tarafta Atölye'
    ],
    info: 'Sanat ve tasarım dersleri'
  },

  // =================== DERSLIKLER - 1. KAT ===================
  {
    id: 'derslik_156', name: 'Derslik 156', category: 'derslik', floor: 1,
    color: '#7b1fa2', icon: '📝',
    x: 290, y: 95, w: 80, h: 55,
    description: 'Fen Lisesi dersliği.',
    directions: ['1. kata çıkın', 'Sol koridorda ilerleyin', 'Öğrt. Odasını geçin — sağda Derslik 156'],
    info: 'Fen Lisesi'
  },
  {
    id: 'derslik_158', name: 'Derslik 158', category: 'derslik', floor: 1,
    color: '#7b1fa2', icon: '📝',
    x: 380, y: 95, w: 80, h: 55,
    description: 'Fen Lisesi dersliği.',
    directions: ['1. kata çıkın', 'Sol koridorda ilerleyin', '156\'yı geçin — Derslik 158'],
    info: 'Fen Lisesi'
  },
  {
    id: 'derslik_162', name: 'Derslik 162', category: 'derslik', floor: 1,
    color: '#7b1fa2', icon: '📝',
    x: 560, y: 350, w: 80, h: 55,
    description: 'Lise dersliği.',
    directions: ['1. kata çıkın', 'Sağ koridora dönün', 'Koridorda ilerleyin — sağda Derslik 162'],
    info: 'Lise Dersliği'
  },
  {
    id: 'derslik_174', name: 'Derslik 174', category: 'derslik', floor: 1,
    color: '#7b1fa2', icon: '📝',
    x: 650, y: 350, w: 80, h: 55,
    description: 'Lise dersliği.',
    directions: ['1. kata çıkın', 'Sağ koridora dönün', '162\'yi geçin — Derslik 174'],
    info: 'Lise Dersliği'
  },

  // =================== DERSLIKLER - 2. KAT ===================
  {
    id: 'fen_lab', name: 'Fen Laboratuvarı', category: 'derslik', floor: 2,
    color: '#7b1fa2', icon: '🔬',
    x: 130, y: 95, w: 140, h: 65,
    description: 'Fizik, Kimya ve Biyoloji deneyleri için tam donanımlı laboratuvar.',
    directions: ['Merdivenden 2. kata çıkın', 'Sola dönün', 'İlk kapı — Fen Laboratuvarı'],
    info: 'Deney malzemeleri mevcuttur'
  },
  {
    id: 'kimya_lab', name: 'Kimya Laboratuvarı', category: 'derslik', floor: 2,
    color: '#7b1fa2', icon: '⚗️',
    x: 280, y: 95, w: 120, h: 65,
    description: 'Kimya deneyleri için özel donanımlı laboratuvar.',
    directions: ['2. kata çıkın', 'Sola dönün', 'Fen Lab\'ı geçin — Kimya Laboratuvarı'],
    info: 'Davlumbaz ve güvenlik ekipmanı mevcut'
  },
  {
    id: 'bilgisayar_lab', name: 'Bilgisayar Lab.', category: 'derslik', floor: 2,
    color: '#7b1fa2', icon: '💻',
    x: 560, y: 95, w: 140, h: 65,
    description: 'Bilişim teknolojileri ve kodlama dersliği. 30 bilgisayar mevcuttur.',
    directions: ['2. kata çıkın', 'Sağ koridora dönün', 'Koridorda ilerleyin — Bilgisayar Lab.'],
    info: '30 adet bilgisayar'
  },
  {
    id: 'derslik_201', name: 'Derslik 201', category: 'derslik', floor: 2,
    color: '#7b1fa2', icon: '📝',
    x: 130, y: 350, w: 80, h: 55,
    description: '2. kat dersliği.',
    directions: ['2. kata çıkın', 'Sol koridorda sonuna ilerleyin', 'Sol tarafta Derslik 201'],
    info: 'Fen Lisesi'
  },
  {
    id: 'derslik_205', name: 'Derslik 205', category: 'derslik', floor: 2,
    color: '#7b1fa2', icon: '📝',
    x: 220, y: 350, w: 80, h: 55,
    description: '2. kat dersliği.',
    directions: ['2. kata çıkın', 'Sol koridorda ilerleyin', '201\'i geçin — Derslik 205'],
    info: 'Fen Lisesi'
  },
  {
    id: 'derslik_210', name: 'Derslik 210', category: 'derslik', floor: 2,
    color: '#7b1fa2', icon: '📝',
    x: 560, y: 350, w: 80, h: 55,
    description: '2. kat dersliği.',
    directions: ['2. kata çıkın', 'Sağ koridora dönün', 'Derslik 210 sağ tarafta'],
    info: 'Lise Dersliği'
  }
];

const FLOOR_NAMES = {
  '-1': 'Bodrum 1. Kat',
  '0': 'Zemin Kat',
  '1': '1. Kat',
  '2': '2. Kat'
};

const FLOOR_DESCRIPTIONS = {
  '-1': 'Amfiteatr, Spor Salonu, Yüzme Havuzu, Atölye',
  '0': 'Ana Giriş, Yönetim, Kantin, Teneffüshane',
  '1': 'Kütüphane, Öğretmenler Odası, Derslikler',
  '2': 'Laboratuvarlar, Derslikler'
};
