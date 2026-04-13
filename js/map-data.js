// FMV Ispartakule Işık Okulları - Konum Verileri
const LOCATIONS = [
  // === YONETIM ===
  {
    id: 'mudur', name: 'Müdür Odası', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '👤',
    x: 180, y: 120, w: 90, h: 60,
    description: 'Okul Müdürü makam odası. Randevu ile görüşme yapılabilir.',
    directions: [
      'Ana girişten içeri girin',
      'Resepsiyonun solundan koridora dönün',
      'Koridorda düz ilerleyin',
      'Sol tarafta Müdür Odası tabelasını göreceksiniz'
    ],
    info: 'Çalışma Saatleri: 08:30 - 17:00'
  },
  {
    id: 'mudur_yrd_1', name: 'Müdür Yardımcısı 1', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '👥',
    x: 180, y: 190, w: 90, h: 60,
    description: 'Müdür Yardımcısı odası. Öğrenci işleri ve disiplin konuları.',
    directions: [
      'Ana girişten içeri girin',
      'Resepsiyonun solundan koridora dönün',
      'Müdür odasını geçin',
      'Hemen yanındaki oda Müdür Yardımcısı odasıdır'
    ],
    info: 'Çalışma Saatleri: 08:00 - 17:00'
  },
  {
    id: 'mudur_yrd_2', name: 'Müdür Yardımcısı 2', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '👥',
    x: 180, y: 260, w: 90, h: 60,
    description: 'Müdür Yardımcısı odası. Eğitim-öğretim koordinasyonu.',
    directions: [
      'Ana girişten içeri girin',
      'Resepsiyonun solundan koridora dönün',
      'Koridorda ilerleyin, Müdür Yrd. 1 odasını geçin',
      'Bir sonraki kapı Müdür Yardımcısı 2 odasıdır'
    ],
    info: 'Çalışma Saatleri: 08:00 - 17:00'
  },
  {
    id: 'rehberlik', name: 'Rehberlik Servisi', category: 'yonetim', floor: 0,
    color: '#1a3a6b', icon: '🎯',
    x: 180, y: 330, w: 90, h: 60,
    description: 'Psikolojik danışmanlık ve rehberlik hizmetleri.',
    directions: [
      'Ana girişten içeri girin',
      'Resepsiyonun solundan koridora dönün',
      'Yönetim odalarını geçerek koridorda ilerleyin',
      'Koridorun sonunda Rehberlik Servisi bulunur'
    ],
    info: 'Randevu ile görüşme yapılabilir'
  },

  // === OGRETMEN ===
  {
    id: 'ogretmenler_odasi', name: 'Öğretmenler Odası', category: 'ogretmen', floor: 1,
    color: '#2e7d32', icon: '📚',
    x: 380, y: 120, w: 130, h: 80,
    description: 'Öğretmenler odası. Teneffüs saatlerinde öğretmenlerle görüşebilirsiniz.',
    directions: [
      'Ana girişten içeri girin',
      'Merdivenleri kullanarak 1. kata çıkın',
      'Merdiven çıkışında sola dönün',
      'Koridorda düz ilerleyin',
      'Sağ tarafta büyük kapılı Öğretmenler Odası görünür'
    ],
    info: 'Teneffüs saatlerinde açıktır'
  },

  // === TUVALETLER ===
  {
    id: 'tuvalet_zemin', name: 'Tuvalet (Zemin Kat)', category: 'tuvalet', floor: 0,
    color: '#0288d1', icon: '🚻',
    x: 620, y: 400, w: 70, h: 50,
    description: 'Zemin kat erkek ve kız tuvaletleri.',
    directions: [
      'Ana girişten içeri girin',
      'Ana koridorda sağa doğru ilerleyin',
      'Koridorun sonuna yakın sağda tuvaletler bulunur'
    ],
    info: 'Erkek ve Kız WC mevcuttur'
  },
  {
    id: 'tuvalet_1', name: 'Tuvalet (1. Kat)', category: 'tuvalet', floor: 1,
    color: '#0288d1', icon: '🚻',
    x: 620, y: 400, w: 70, h: 50,
    description: '1. kat erkek ve kız tuvaletleri.',
    directions: [
      'Merdivenleri kullanarak 1. kata çıkın',
      'Merdiven çıkışında sağa dönün',
      'Koridorun sonunda tuvaletler bulunur'
    ],
    info: 'Erkek ve Kız WC mevcuttur'
  },
  {
    id: 'tuvalet_2', name: 'Tuvalet (2. Kat)', category: 'tuvalet', floor: 2,
    color: '#0288d1', icon: '🚻',
    x: 620, y: 400, w: 70, h: 50,
    description: '2. kat erkek ve kız tuvaletleri.',
    directions: [
      'Merdivenleri kullanarak 2. kata çıkın',
      'Merdiven çıkışında sağa dönün',
      'Koridorun sonunda tuvaletler bulunur'
    ],
    info: 'Erkek ve Kız WC mevcuttur'
  },
  {
    id: 'tuvalet_bodrum', name: 'Tuvalet (Bodrum Kat)', category: 'tuvalet', floor: -1,
    color: '#0288d1', icon: '🚻',
    x: 620, y: 400, w: 70, h: 50,
    description: 'Bodrum kat tuvaletleri.',
    directions: [
      'Merdivenleri kullanarak bodrum kata inin',
      'Merdiven çıkışında sağa dönün',
      'Koridorda ilerleyin, tuvaletler sağ taraftadır'
    ],
    info: 'Erkek ve Kız WC mevcuttur'
  },

  // === ORTAK ALANLAR ===
  {
    id: 'kantin', name: 'Kantin / Yemekhane', category: 'ortak', floor: 0,
    color: '#f57c00', icon: '🍽',
    x: 600, y: 120, w: 120, h: 80,
    description: 'Okul kantini ve yemekhane alanı.',
    directions: [
      'Ana girişten içeri girin',
      'Ana koridorda sağa doğru ilerleyin',
      'Koridorun sağ tarafında Kantin tabelasını takip edin'
    ],
    info: 'Öğle arası: 12:00 - 13:00'
  },
  {
    id: 'kutuphane', name: 'Kütüphane', category: 'ortak', floor: 1,
    color: '#f57c00', icon: '📖',
    x: 380, y: 280, w: 130, h: 70,
    description: 'Okul kütüphanesi. Ders çalışma ve kitap okuma alanı.',
    directions: [
      'Merdivenleri kullanarak 1. kata çıkın',
      'Merdiven çıkışında sola dönün',
      'Öğretmenler odasını geçin',
      'Sağ tarafta Kütüphane görünür'
    ],
    info: '08:30 - 16:30 arası açıktır'
  },
  {
    id: 'amfiteatr', name: 'Amfiteatr / Salon', category: 'ortak', floor: -1,
    color: '#f57c00', icon: '🎭',
    x: 180, y: 150, w: 180, h: 120,
    description: 'Konferans salonu ve amfitiyatro. Etkinlikler ve toplantılar için kullanılır.',
    directions: [
      'Ana girişten içeri girin',
      'Merdivenleri kullanarak bodrum kata inin',
      'Merdiven çıkışında sola dönün',
      'Büyük kapılı Amfiteatr girişi sol taraftadır'
    ],
    info: 'Etkinlik ve toplantılar için kullanılır'
  },
  {
    id: 'teneffushane', name: 'Teneffüshane', category: 'ortak', floor: 0,
    color: '#f57c00', icon: '☀️',
    x: 750, y: 80, w: 140, h: 200,
    description: 'Açık hava teneffüs ve dinlenme alanı.',
    directions: [
      'Ana girişten içeri girin',
      'Ana koridorda sağa doğru en sona ilerleyin',
      'Koridorun sonundaki kapıdan Teneffüshaneye çıkın'
    ],
    info: 'Teneffüs saatlerinde kullanılabilir'
  },
  {
    id: 'spor_salonu', name: 'Spor Salonu', category: 'ortak', floor: -1,
    color: '#f57c00', icon: '⚽',
    x: 500, y: 150, w: 140, h: 100,
    description: 'Kapalı spor salonu. Beden eğitimi dersleri ve spor etkinlikleri.',
    directions: [
      'Ana girişten içeri girin',
      'Merdivenleri kullanarak bodrum kata inin',
      'Merdiven çıkışında sağa dönün',
      'Koridorda düz ilerleyin, Spor Salonu sağ taraftadır'
    ],
    info: 'Beden Eğitimi dersleri burada yapılır'
  },

  // === DERSLIKLER - 1. KAT ===
  {
    id: 'derslik_156', name: 'Derslik 156', category: 'derslik', floor: 1,
    color: '#7b1fa2', icon: '🏫',
    x: 140, y: 120, w: 80, h: 60,
    description: 'Fen Lisesi dersliği.',
    directions: [
      'Merdivenleri kullanarak 1. kata çıkın',
      'Sola dönün, koridorda ilerleyin',
      'Sol tarafta 156 numaralı derslik'
    ],
    info: 'Fen Lisesi Dersliği'
  },
  {
    id: 'derslik_162', name: 'Derslik 162', category: 'derslik', floor: 1,
    color: '#7b1fa2', icon: '🏫',
    x: 530, y: 120, w: 80, h: 60,
    description: 'Fen Lisesi dersliği.',
    directions: [
      'Merdivenleri kullanarak 1. kata çıkın',
      'Sağa dönün, koridorda ilerleyin',
      'Sağ tarafta 162 numaralı derslik'
    ],
    info: 'Fen Lisesi Dersliği'
  },
  {
    id: 'derslik_174', name: 'Derslik 174', category: 'derslik', floor: 1,
    color: '#7b1fa2', icon: '🏫',
    x: 530, y: 340, w: 80, h: 60,
    description: 'Lise dersliği.',
    directions: [
      'Merdivenleri kullanarak 1. kata çıkın',
      'Sağa dönün, koridorun sonuna ilerleyin',
      'Sağ tarafta 174 numaralı derslik'
    ],
    info: 'Lise Dersliği'
  },

  // === DERSLIKLER - 2. KAT ===
  {
    id: 'fen_lab', name: 'Fen Laboratuvarı', category: 'derslik', floor: 2,
    color: '#7b1fa2', icon: '🔬',
    x: 380, y: 120, w: 130, h: 70,
    description: 'Fizik, Kimya ve Biyoloji deneyleri için laboratuvar.',
    directions: [
      'Merdivenleri kullanarak 2. kata çıkın',
      'Merdiven çıkışında sola dönün',
      'Koridorda ilerleyin, Fen Laboratuvarı sağ taraftadır'
    ],
    info: 'Fen dersleri için kullanılır'
  },
  {
    id: 'bilgisayar_lab', name: 'Bilgisayar Laboratuvarı', category: 'derslik', floor: 2,
    color: '#7b1fa2', icon: '💻',
    x: 380, y: 280, w: 130, h: 70,
    description: 'Bilişim teknolojileri dersliği.',
    directions: [
      'Merdivenleri kullanarak 2. kata çıkın',
      'Merdiven çıkışında sola dönün',
      'Fen Lab\'ı geçin, Bilgisayar Laboratuvarı ileridedir'
    ],
    info: 'Bilişim Teknolojileri dersleri'
  }
];

// Kat isimleri
const FLOOR_NAMES = {
  '-1': 'Bodrum 1. Kat',
  '0': 'Zemin Kat',
  '1': '1. Kat',
  '2': '2. Kat'
};
