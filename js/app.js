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

  updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const el = (id) => document.getElementById(id);
    if (el('splash-clock')) el('splash-clock').textContent = time;
    if (el('splash-date')) el('splash-date').textContent = date;
    if (el('main-clock')) el('main-clock').textContent = time;
    if (el('main-date')) el('main-date').textContent = date;
  },

  showMainScreen() {
    document.getElementById('splash-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    this.resetInactivity();
  },

  showSplashScreen() {
    document.getElementById('main-screen').classList.remove('active');
    document.getElementById('splash-screen').classList.add('active');
  },

  setupInactivity() { this.resetInactivity(); },

  resetInactivity() {
    const ov = document.getElementById('inactivity-overlay');
    ov.classList.remove('visible');
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownTimer);
    this.inactivityTimer = setTimeout(() => this.showInactivityWarning(), 60000);
  },

  showInactivityWarning() {
    const ov = document.getElementById('inactivity-overlay');
    const ct = document.getElementById('inactivity-countdown');
    ov.classList.add('visible');
    this.countdownValue = 15;
    ct.textContent = this.countdownValue;
    this.countdownTimer = setInterval(() => {
      this.countdownValue--;
      ct.textContent = this.countdownValue;
      if (this.countdownValue <= 0) {
        clearInterval(this.countdownTimer);
        ov.classList.remove('visible');
        this.showSplashScreen();
        this.resetInactivity();
      }
    }, 1000);
  },

  selectFloor(floor) {
    this.currentFloor = floor;
    document.querySelectorAll('.floor-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.floor) === floor);
    });
    this.renderMap();
    this.renderLocationList();
  },

  selectCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('.category-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.category === cat);
    });
    this.renderLocationList();
  },

  filterLocations(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.location-item').forEach(item => {
      item.style.display = item.dataset.name.toLowerCase().includes(q) ? 'flex' : 'none';
    });
  },

  renderLocationList() {
    const list = document.getElementById('location-list');
    const locs = LOCATIONS.filter(l => this.currentCategory === 'all' || l.category === this.currentCategory);
    list.innerHTML = locs.map(loc => `
      <div class="location-item ${this.selectedLocation === loc.id ? 'selected' : ''}"
           data-id="${loc.id}" data-name="${loc.name}"
           onclick="app.selectLocation('${loc.id}')">
        <div class="loc-icon" style="background:${loc.color}">${loc.icon}</div>
        <div class="loc-info">
          <h4>${loc.name}</h4>
          <span>${FLOOR_NAMES[loc.floor]}</span>
        </div>
      </div>`).join('');
  },

  selectLocation(id) {
    this.selectedLocation = id;
    const loc = LOCATIONS.find(l => l.id === id);
    if (!loc) return;
    if (loc.floor !== this.currentFloor) this.selectFloor(loc.floor);
    this.renderLocationList();
    this.renderMap();
    this.showDetail(loc);
  },

  quickNav(id) { this.selectLocation(id); },

  showDetail(loc) {
    document.querySelector('.detail-placeholder').style.display = 'none';
    const c = document.getElementById('detail-content');
    c.style.display = 'block';
    document.getElementById('detail-icon').style.background = loc.color;
    document.getElementById('detail-icon').innerHTML = `<span style="font-size:1.5rem">${loc.icon}</span>`;
    document.getElementById('detail-name').textContent = loc.name;
    document.getElementById('detail-floor').textContent = FLOOR_NAMES[loc.floor];
    document.getElementById('detail-description').textContent = loc.description;
    document.getElementById('direction-steps').innerHTML = loc.directions.map((s, i) => `
      <div class="direction-step">
        <div class="step-number">${i + 1}</div>
        <div class="step-text">${s}</div>
      </div>`).join('');
    document.getElementById('detail-info').innerHTML = `
      <div class="detail-info-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>${loc.info}</span>
      </div>
      <div class="detail-info-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${FLOOR_NAMES[loc.floor]}</span>
      </div>`;
  },

  closeDetail() {
    document.getElementById('detail-content').style.display = 'none';
    document.querySelector('.detail-placeholder').style.display = 'flex';
    this.selectedLocation = null;
    this.renderLocationList();
    this.renderMap();
  },

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

  // ===================== HARITA RENDER =====================
  renderMap() {
    const svg = document.getElementById('school-map');
    const f = this.currentFloor;
    let h = '';

    // Gradient tanımları
    h += `<defs>
      <linearGradient id="gBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#eef2f7"/>
      </linearGradient>
      <linearGradient id="gCorr" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#e8ecf1"/><stop offset="50%" stop-color="#f1f4f8"/><stop offset="100%" stop-color="#e8ecf1"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.15"/></filter>
      <pattern id="tiles" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#f1f4f8"/><rect width="19" height="19" fill="#edf0f5"/>
      </pattern>
      <pattern id="grass" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#c8e6c9"/><circle cx="2" cy="3" r="0.8" fill="#a5d6a7"/><circle cx="6" cy="7" r="0.6" fill="#a5d6a7"/>
      </pattern>
    </defs>`;

    // Bina yapısı
    h += this.drawBuilding(f);

    // Odalar
    LOCATIONS.filter(l => l.floor === f).forEach(loc => {
      const sel = this.selectedLocation === loc.id;
      const rx = loc.w > 120 ? 6 : 4;
      h += `<g class="room ${sel ? 'highlighted' : ''}" onclick="app.selectLocation('${loc.id}')" style="cursor:pointer">
        <rect x="${loc.x}" y="${loc.y}" width="${loc.w}" height="${loc.h}" rx="${rx}"
              fill="${loc.color}" fill-opacity="${sel ? 0.95 : 0.75}"
              stroke="${sel ? '#c62828' : '#fff'}" stroke-width="${sel ? 3 : 1}" filter="url(#shadow)"/>
        <text x="${loc.x + loc.w / 2}" y="${loc.y + loc.h / 2 - (loc.h > 60 ? 4 : 2)}"
              text-anchor="middle" dominant-baseline="central"
              font-family="Inter,sans-serif" font-size="${loc.w > 120 ? 11 : 9}" font-weight="600" fill="white">
          ${this.truncate(loc.name, loc.w > 120 ? 20 : 14)}</text>
        <text x="${loc.x + loc.w / 2}" y="${loc.y + loc.h / 2 + (loc.h > 60 ? 14 : 11)}"
              text-anchor="middle" font-size="${loc.h > 60 ? 16 : 13}">${loc.icon}</text>
      </g>`;
    });

    // Kiosk konumu (zemin kat)
    if (f === 0) {
      h += `<g class="kiosk-marker">
        <circle cx="500" cy="505" r="6" fill="#c62828"/>
        <circle cx="500" cy="505" r="10" fill="none" stroke="#c62828" stroke-width="2" opacity="0.5">
          <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="500" y="525" text-anchor="middle" font-size="9" fill="#c62828" font-weight="700" font-family="Inter,sans-serif">📍 Buradasınız (Kiosk)</text>
      </g>`;
    }

    // Başlık
    h += `<text x="500" y="28" text-anchor="middle" font-size="15" font-weight="800" fill="#1a3a6b" font-family="Inter,sans-serif">
      ${FLOOR_NAMES[f]} — FMV Ispartakule Işık Okulları</text>`;
    h += `<text x="500" y="44" text-anchor="middle" font-size="9" fill="#6b7280" font-family="Inter,sans-serif">
      ${FLOOR_DESCRIPTIONS[f]}</text>`;

    svg.innerHTML = h;
  },

  truncate(str, max) {
    return str.length > max ? str.substring(0, max - 1) + '…' : str;
  },

  drawBuilding(floor) {
    let s = '';

    // === Zemin: bina dış çerçeve ===
    // Açık alan (teneffüshane sağ taraf) + bina sol taraf
    // L-şekilli bina yapısı (tahliye planına uygun)

    // Dış zemin
    s += `<rect x="60" y="55" width="880" height="485" rx="0" fill="#e0e4ea" opacity="0.3"/>`;

    // ANA BİNA — L şeklinde üst blok
    s += `<rect x="100" y="60" width="640" height="220" rx="3" fill="url(#tiles)" stroke="#9ca3af" stroke-width="2.5"/>`;
    // ANA BİNA — L şeklinde sol blok (aşağı uzanan)
    s += `<rect x="100" y="60" width="260" height="440" rx="3" fill="url(#tiles)" stroke="#9ca3af" stroke-width="2.5"/>`;
    // ANA BİNA — sağ alt blok (derslikler)
    s += `<rect x="470" y="280" width="270" height="220" rx="3" fill="url(#tiles)" stroke="#9ca3af" stroke-width="2.5"/>`;

    // Teneffüshane (açık alan, sağ üst)
    if (floor >= 0) {
      s += `<rect x="760" y="60" width="160" height="440" rx="4" fill="url(#grass)" stroke="#66bb6a" stroke-width="2" stroke-dasharray="6 3"/>`;
      s += `<text x="840" y="200" text-anchor="middle" font-size="10" fill="#388e3c" font-weight="600" font-family="Inter,sans-serif">TENEFFÜSHANE</text>`;
      s += `<text x="840" y="216" text-anchor="middle" font-size="8" fill="#4caf50" font-family="Inter,sans-serif">(Açık Alan)</text>`;
      // Ağaçlar
      s += `<circle cx="790" cy="120" r="6" fill="#81c784" opacity="0.7"/>`;
      s += `<circle cx="880" cy="160" r="5" fill="#a5d6a7" opacity="0.6"/>`;
      s += `<circle cx="800" cy="300" r="7" fill="#81c784" opacity="0.7"/>`;
      s += `<circle cx="890" cy="380" r="5" fill="#a5d6a7" opacity="0.6"/>`;
      // Oturma bankları
      s += `<rect x="810" y="250" width="30" height="6" rx="2" fill="#8d6e63"/>`;
      s += `<rect x="850" y="330" width="30" height="6" rx="2" fill="#8d6e63"/>`;
    }

    // === KORİDORLAR ===
    // Üst yatay koridor
    s += `<rect x="110" y="165" width="620" height="30" rx="1" fill="url(#gCorr)" stroke="#d1d5db" stroke-width="0.5"/>`;
    if (floor !== -1) {
      s += `<text x="420" y="184" text-anchor="middle" font-size="8" fill="#9ca3af" font-family="Inter,sans-serif" letter-spacing="2">— — — ANA KORİDOR — — —</text>`;
    } else {
      s += `<text x="420" y="184" text-anchor="middle" font-size="8" fill="#9ca3af" font-family="Inter,sans-serif" letter-spacing="2">— — — KORİDOR — — —</text>`;
    }

    // Sol dikey koridor
    s += `<rect x="240" y="60" width="30" height="440" rx="1" fill="url(#gCorr)" stroke="#d1d5db" stroke-width="0.5"/>`;

    // Alt yatay koridor (sağ blok)
    s += `<rect x="240" y="335" width="500" height="28" rx="1" fill="url(#gCorr)" stroke="#d1d5db" stroke-width="0.5"/>`;

    // Sağ dikey koridor
    s += `<rect x="530" y="165" width="28" height="200" rx="1" fill="url(#gCorr)" stroke="#d1d5db" stroke-width="0.5"/>`;

    // === MERDİVENLER ===
    // Sol merdiven
    s += this.drawStairs(242, 455, 'Sol Merdiven');
    // Orta merdiven
    s += this.drawStairs(532, 145, 'Ana Merdiven');

    // === KATA ÖZEL DETAYLAR ===
    if (floor === 0) {
      // Ana giriş kapısı
      s += `<rect x="370" y="268" width="100" height="14" rx="3" fill="#1b5e20" stroke="#2e7d32" stroke-width="1.5"/>`;
      s += `<text x="420" y="279" text-anchor="middle" font-size="9" fill="white" font-weight="700" font-family="Inter,sans-serif">🚪 ANA GİRİŞ</text>`;

      // Resepsiyon
      s += `<rect x="370" y="200" width="100" height="35" rx="4" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5" filter="url(#shadow)"/>`;
      s += `<text x="420" y="220" text-anchor="middle" font-size="10" fill="#1565c0" font-weight="600" font-family="Inter,sans-serif">Resepsiyon</text>`;

      // Güvenlik
      s += `<rect x="310" y="240" width="55" height="25" rx="3" fill="#fff8e1" stroke="#f9a825" stroke-width="1"/>`;
      s += `<text x="337" y="256" text-anchor="middle" font-size="7" fill="#f57f17" font-weight="600">Güvenlik</text>`;

      // Toplanma noktası
      s += `<rect x="770" y="460" width="70" height="35" rx="4" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5" stroke-dasharray="5 3"/>`;
      s += `<text x="805" y="475" text-anchor="middle" font-size="7" fill="#2e7d32" font-weight="700">🏁 Toplanma</text>`;
      s += `<text x="805" y="487" text-anchor="middle" font-size="7" fill="#2e7d32" font-weight="600">Noktası</text>`;
    }

    if (floor === 1) {
      // Bölüm etiketleri
      s += `<rect x="115" y="62" width="110" height="18" rx="3" fill="#7b1fa2" opacity="0.12"/>`;
      s += `<text x="170" y="74" text-anchor="middle" font-size="8" fill="#7b1fa2" font-weight="700">FEN LİSESİ</text>`;
      s += `<rect x="575" y="282" width="110" height="18" rx="3" fill="#7b1fa2" opacity="0.12"/>`;
      s += `<text x="630" y="294" text-anchor="middle" font-size="8" fill="#7b1fa2" font-weight="700">LİSE DERSLİKLERİ</text>`;
    }

    if (floor === 2) {
      s += `<rect x="115" y="62" width="130" height="18" rx="3" fill="#7b1fa2" opacity="0.12"/>`;
      s += `<text x="180" y="74" text-anchor="middle" font-size="8" fill="#7b1fa2" font-weight="700">LABORATUVARLAR</text>`;
      s += `<rect x="475" y="282" width="120" height="18" rx="3" fill="#7b1fa2" opacity="0.12"/>`;
      s += `<text x="535" y="294" text-anchor="middle" font-size="8" fill="#7b1fa2" font-weight="700">DERSLİKLER</text>`;
    }

    if (floor === -1) {
      // Bodrum kat özel etiketler
      s += `<rect x="115" y="62" width="160" height="18" rx="3" fill="#f57c00" opacity="0.12"/>`;
      s += `<text x="195" y="74" text-anchor="middle" font-size="8" fill="#e65100" font-weight="700">ETKİNLİK ALANI</text>`;
      s += `<rect x="455" y="62" width="160" height="18" rx="3" fill="#f57c00" opacity="0.12"/>`;
      s += `<text x="535" y="74" text-anchor="middle" font-size="8" fill="#e65100" font-weight="700">SPOR TESİSLERİ</text>`;
    }

    // === ACİL ÇIKIŞ İŞARETLERİ ===
    s += this.drawExitSign(732, 170);
    s += this.drawExitSign(100, 375);

    // Yangın söndürücü sembolleri
    s += this.drawFireExt(260, 150);
    s += this.drawFireExt(520, 330);

    // Duvar detayları - kapı aralıkları
    for (let i = 0; i < 3; i++) {
      const dx = 300 + i * 130;
      s += `<line x1="${dx}" y1="165" x2="${dx}" y2="168" stroke="#6b7280" stroke-width="1.5"/>`;
    }

    return s;
  },

  drawStairs(x, y, label) {
    let s = `<g>`;
    s += `<rect x="${x}" y="${y}" width="26" height="40" rx="3" fill="#fff3e0" stroke="#f57c00" stroke-width="1.5"/>`;
    // Merdiven çizgileri
    for (let i = 0; i < 5; i++) {
      s += `<line x1="${x + 4}" y1="${y + 6 + i * 7}" x2="${x + 22}" y2="${y + 6 + i * 7}" stroke="#ffb74d" stroke-width="1.5"/>`;
    }
    s += `<text x="${x + 13}" y="${y + 52}" text-anchor="middle" font-size="6" fill="#e65100" font-weight="600" font-family="Inter,sans-serif">${label}</text>`;
    s += `</g>`;
    return s;
  },

  drawExitSign(x, y) {
    return `<g>
      <rect x="${x}" y="${y}" width="36" height="16" rx="2" fill="#d32f2f"/>
      <text x="${x + 18}" y="${y + 12}" text-anchor="middle" font-size="7" fill="white" font-weight="700" font-family="Inter,sans-serif">ACİL ▸</text>
    </g>`;
  },

  drawFireExt(x, y) {
    return `<g>
      <circle cx="${x}" cy="${y}" r="5" fill="#ff5252" opacity="0.8"/>
      <text x="${x}" y="${y + 3}" text-anchor="middle" font-size="6" fill="white" font-weight="700">🧯</text>
    </g>`;
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
