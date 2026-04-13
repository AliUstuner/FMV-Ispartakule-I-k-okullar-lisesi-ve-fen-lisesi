// FMV Ispartakule Işık Okulları - Kiosk Uygulaması
const app = {
  currentFloor: 0,
  currentCategory: 'all',
  selectedLocation: null,
  zoomLevel: 1,
  inactivityTimer: null,
  countdownTimer: null,
  countdownValue: 15,

  init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.renderLocationList();
    this.renderMap();
    this.setupInactivity();
    document.addEventListener('click', () => this.resetInactivity());
    document.addEventListener('touchstart', () => this.resetInactivity());
  },

  // === SAAT ===
  updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const els = (id) => document.getElementById(id);
    if (els('splash-clock')) els('splash-clock').textContent = time;
    if (els('splash-date')) els('splash-date').textContent = date;
    if (els('main-clock')) els('main-clock').textContent = time;
    if (els('main-date')) els('main-date').textContent = date;
  },

  // === EKRAN GEÇİŞ ===
  showMainScreen() {
    document.getElementById('splash-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    this.resetInactivity();
  },

  showSplashScreen() {
    document.getElementById('main-screen').classList.remove('active');
    document.getElementById('splash-screen').classList.add('active');
  },

  // === INACTIVITY ===
  setupInactivity() {
    this.resetInactivity();
  },

  resetInactivity() {
    const overlay = document.getElementById('inactivity-overlay');
    overlay.classList.remove('visible');
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownTimer);
    this.inactivityTimer = setTimeout(() => this.showInactivityWarning(), 60000);
  },

  showInactivityWarning() {
    const overlay = document.getElementById('inactivity-overlay');
    const counter = document.getElementById('inactivity-countdown');
    overlay.classList.add('visible');
    this.countdownValue = 15;
    counter.textContent = this.countdownValue;
    this.countdownTimer = setInterval(() => {
      this.countdownValue--;
      counter.textContent = this.countdownValue;
      if (this.countdownValue <= 0) {
        clearInterval(this.countdownTimer);
        overlay.classList.remove('visible');
        this.showSplashScreen();
        this.resetInactivity();
      }
    }, 1000);
  },

  // === KAT SEÇİMİ ===
  selectFloor(floor) {
    this.currentFloor = floor;
    document.querySelectorAll('.floor-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.floor) === floor);
    });
    this.renderMap();
    this.renderLocationList();
  },

  // === KATEGORİ ===
  selectCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === cat);
    });
    this.renderLocationList();
  },

  // === ARAMA ===
  filterLocations(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.location-item').forEach(item => {
      const name = item.dataset.name.toLowerCase();
      item.style.display = name.includes(q) ? 'flex' : 'none';
    });
  },

  // === KONUM LİSTESİ ===
  renderLocationList() {
    const list = document.getElementById('location-list');
    const locs = LOCATIONS.filter(loc => {
      if (this.currentCategory !== 'all' && loc.category !== this.currentCategory) return false;
      return true;
    });

    list.innerHTML = locs.map(loc => `
      <div class="location-item ${this.selectedLocation === loc.id ? 'selected' : ''}"
           data-id="${loc.id}" data-name="${loc.name}"
           onclick="app.selectLocation('${loc.id}')">
        <div class="loc-icon" style="background:${loc.color}">${loc.icon}</div>
        <div class="loc-info">
          <h4>${loc.name}</h4>
          <span>${FLOOR_NAMES[loc.floor] || 'Zemin Kat'}</span>
        </div>
      </div>
    `).join('');
  },

  // === KONUM SEÇ ===
  selectLocation(id) {
    this.selectedLocation = id;
    const loc = LOCATIONS.find(l => l.id === id);
    if (!loc) return;

    // Katı değiştir
    if (loc.floor !== this.currentFloor) {
      this.selectFloor(loc.floor);
    }

    this.renderLocationList();
    this.renderMap();
    this.showDetail(loc);
  },

  // === HIZLI NAV ===
  quickNav(id) {
    this.selectLocation(id);
  },

  // === DETAY PANEL ===
  showDetail(loc) {
    document.querySelector('.detail-placeholder').style.display = 'none';
    const content = document.getElementById('detail-content');
    content.style.display = 'block';

    document.getElementById('detail-icon').style.background = loc.color;
    document.getElementById('detail-icon').innerHTML = `<span style="font-size:1.5rem">${loc.icon}</span>`;
    document.getElementById('detail-name').textContent = loc.name;
    document.getElementById('detail-floor').textContent = FLOOR_NAMES[loc.floor] || 'Zemin Kat';
    document.getElementById('detail-description').textContent = loc.description;

    const steps = document.getElementById('direction-steps');
    steps.innerHTML = loc.directions.map((step, i) => `
      <div class="direction-step">
        <div class="step-number">${i + 1}</div>
        <div class="step-text">${step}</div>
      </div>
    `).join('');

    const info = document.getElementById('detail-info');
    info.innerHTML = `
      <div class="detail-info-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>${loc.info}</span>
      </div>
      <div class="detail-info-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${FLOOR_NAMES[loc.floor] || 'Zemin Kat'}</span>
      </div>
    `;
  },

  closeDetail() {
    document.getElementById('detail-content').style.display = 'none';
    document.querySelector('.detail-placeholder').style.display = 'flex';
    this.selectedLocation = null;
    this.renderLocationList();
    this.renderMap();
  },

  // === ZOOM ===
  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.2, 2.5);
    document.getElementById('school-map').style.transform = `scale(${this.zoomLevel})`;
  },
  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.2, 0.5);
    document.getElementById('school-map').style.transform = `scale(${this.zoomLevel})`;
  },
  resetZoom() {
    this.zoomLevel = 1;
    document.getElementById('school-map').style.transform = 'scale(1)';
  },

  // === HARİTA RENDER ===
  renderMap() {
    const svg = document.getElementById('school-map');
    const floor = this.currentFloor;
    let html = '';

    // Dış duvarlar ve yapı
    html += this.drawBuilding(floor);

    // Odaları çiz
    const floorLocs = LOCATIONS.filter(l => l.floor === floor);
    floorLocs.forEach(loc => {
      const sel = this.selectedLocation === loc.id;
      html += `
        <g class="room ${sel ? 'highlighted' : ''}" onclick="app.selectLocation('${loc.id}')">
          <rect x="${loc.x}" y="${loc.y}" width="${loc.w}" height="${loc.h}"
                rx="4" fill="${loc.color}" fill-opacity="${sel ? 0.9 : 0.7}"
                stroke="${sel ? '#c62828' : loc.color}" stroke-width="${sel ? 3 : 1.5}"/>
          <text x="${loc.x + loc.w / 2}" y="${loc.y + loc.h / 2 - 6}" class="room-label"
                font-size="${loc.w > 100 ? 11 : 9}">${loc.name}</text>
          <text x="${loc.x + loc.w / 2}" y="${loc.y + loc.h / 2 + 10}" class="room-label"
                font-size="8" opacity="0.8">${loc.icon}</text>
        </g>`;
    });

    // Kiosk konumu (sadece zemin kat)
    if (floor === 0) {
      html += `
        <g class="kiosk-marker">
          <circle cx="460" cy="470" r="10" fill="#c62828"/>
          <circle cx="460" cy="470" r="16" fill="none" stroke="#c62828" stroke-width="2" opacity="0.5"/>
          <text x="460" y="500" text-anchor="middle" font-size="9" fill="#c62828" font-weight="700">📍 Buradasınız</text>
        </g>`;
    }

    // Kat ismi
    html += `<text x="500" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="#1a3a6b">
      ${FLOOR_NAMES[floor] || 'Kat'} - FMV Ispartakule Işık Okulları
    </text>`;

    svg.innerHTML = html;
  },

  drawBuilding(floor) {
    let s = '';
    // Dış duvarlar
    s += `<rect x="100" y="50" width="800" height="470" rx="6" fill="#f8f9fa" stroke="#adb5bd" stroke-width="2"/>`;

    // Ana koridor (yatay)
    s += `<rect x="120" y="210" width="760" height="50" rx="2" fill="#e9ecef" stroke="#dee2e6" stroke-width="1"/>`;
    s += `<text x="500" y="240" class="corridor-label" font-size="10">Ana Koridor</text>`;

    // Dikey koridor
    s += `<rect x="440" y="60" width="50" height="450" rx="2" fill="#e9ecef" stroke="#dee2e6" stroke-width="1"/>`;

    // Merdivenler
    s += `<rect x="430" y="65" width="70" height="45" rx="3" fill="#fff3e0" stroke="#f57c00" stroke-width="1.5"/>`;
    s += `<text x="465" y="85" text-anchor="middle" font-size="8" fill="#f57c00" font-weight="600">🔼 Merdiven</text>`;
    s += `<text x="465" y="100" text-anchor="middle" font-size="7" fill="#e65100">Tüm Katlar</text>`;

    if (floor === 0) {
      // Giriş
      s += `<rect x="420" y="490" width="90" height="30" rx="4" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>`;
      s += `<text x="465" y="510" text-anchor="middle" font-size="10" fill="#2e7d32" font-weight="700">🚪 ANA GİRİŞ</text>`;

      // Resepsiyon
      s += `<rect x="370" y="400" width="100" height="50" rx="4" fill="#e3f2fd" stroke="#1565c0" stroke-width="1"/>`;
      s += `<text x="420" y="430" text-anchor="middle" font-size="9" fill="#1565c0" font-weight="600">Resepsiyon</text>`;
    }

    if (floor === -1) {
      // Bodrum özel alanlar
      s += `<text x="500" y="530" text-anchor="middle" font-size="9" fill="#adb5bd">Bodrum 1. Kat - Amfiteatr ve Spor Alanları</text>`;
    }

    if (floor === 1) {
      // 1. kat özel label
      s += `<text x="300" y="75" text-anchor="middle" font-size="10" fill="#7b1fa2" font-weight="600">Fen Lisesi Derslikleri</text>`;
      s += `<text x="700" y="75" text-anchor="middle" font-size="10" fill="#7b1fa2" font-weight="600">Lise Derslikleri</text>`;
    }

    if (floor === 2) {
      s += `<text x="500" y="530" text-anchor="middle" font-size="9" fill="#adb5bd">2. Kat - Laboratuvarlar ve Derslikler</text>`;
    }

    // Acil çıkış
    s += `<rect x="860" y="220" width="30" height="30" rx="2" fill="#c62828" stroke="#b71c1c" stroke-width="1"/>`;
    s += `<text x="875" y="240" text-anchor="middle" font-size="8" fill="white" font-weight="700">ACİL</text>`;

    // Toplanma noktası (zemin kat)
    if (floor === 0) {
      s += `<g>
        <rect x="830" y="440" width="60" height="50" rx="4" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="860" y="462" text-anchor="middle" font-size="7" fill="#2e7d32" font-weight="600">Toplanma</text>
        <text x="860" y="478" text-anchor="middle" font-size="7" fill="#2e7d32" font-weight="600">Noktası</text>
      </g>`;
    }

    return s;
  }
};

// Başlat
document.addEventListener('DOMContentLoaded', () => app.init());
