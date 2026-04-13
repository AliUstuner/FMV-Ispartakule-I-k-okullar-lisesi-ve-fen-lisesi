// FMV Ispartakule Işık Okulları - Kiosk v3
const app = {
  currentFloor: 0, currentCategory: 'all', selectedLocation: null,
  zoomLevel: 1, inactivityTimer: null, countdownTimer: null,

  init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.renderLocationList();
    this.renderMap();
    this.resetInactivity();
    document.addEventListener('click', () => this.resetInactivity());
    document.addEventListener('touchstart', () => this.resetInactivity());
  },

  updateClock() {
    const now = new Date();
    const t = now.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
    const d = now.toLocaleDateString('tr-TR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    ['splash-clock','main-clock'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=t});
    ['splash-date','main-date'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=d});
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

  resetInactivity() {
    const o=document.getElementById('inactivity-overlay'); o.classList.remove('visible');
    clearTimeout(this.inactivityTimer); clearInterval(this.countdownTimer);
    this.inactivityTimer=setTimeout(()=>this.showInactivityWarning(),60000);
  },
  showInactivityWarning() {
    const o=document.getElementById('inactivity-overlay'),c=document.getElementById('inactivity-countdown');
    o.classList.add('visible'); let v=15; c.textContent=v;
    this.countdownTimer=setInterval(()=>{v--;c.textContent=v;
      if(v<=0){clearInterval(this.countdownTimer);o.classList.remove('visible');this.showSplashScreen();this.resetInactivity();}
    },1000);
  },

  selectFloor(f) {
    this.currentFloor=f;
    document.querySelectorAll('.floor-btn').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.floor)===f));
    this.renderMap(); this.renderLocationList();
  },
  selectCategory(c) {
    this.currentCategory=c;
    document.querySelectorAll('.category-btn').forEach(b=>b.classList.toggle('active',b.dataset.category===c));
    this.renderLocationList();
  },
  filterLocations(q) {
    const s=q.toLowerCase().trim();
    document.querySelectorAll('.location-item').forEach(i=>{i.style.display=i.dataset.name.toLowerCase().includes(s)?'flex':'none'});
  },

  renderLocationList() {
    const list=document.getElementById('location-list');
    const locs=LOCATIONS.filter(l=>this.currentCategory==='all'||l.category===this.currentCategory);
    list.innerHTML=locs.map(l=>`
      <div class="location-item ${this.selectedLocation===l.id?'selected':''}" data-id="${l.id}" data-name="${l.name}" onclick="app.selectLocation('${l.id}')">
        <div class="loc-icon" style="background:${l.color}">${l.icon}</div>
        <div class="loc-info"><h4>${l.name}</h4><span>${FLOOR_NAMES[l.floor]}</span></div>
      </div>`).join('');
  },

  selectLocation(id) {
    this.selectedLocation=id;
    const l=LOCATIONS.find(x=>x.id===id); if(!l)return;
    if(l.floor!==this.currentFloor)this.selectFloor(l.floor);
    this.renderLocationList(); this.renderMap(); this.showDetail(l);
  },
  quickNav(id){this.selectLocation(id)},

  showDetail(l) {
    document.querySelector('.detail-placeholder').style.display='none';
    document.getElementById('detail-content').style.display='block';
    document.getElementById('detail-icon').style.background=l.color;
    document.getElementById('detail-icon').innerHTML=`<span style="font-size:1.5rem">${l.icon}</span>`;
    document.getElementById('detail-name').textContent=l.name;
    document.getElementById('detail-floor').textContent=FLOOR_NAMES[l.floor];
    document.getElementById('detail-description').textContent=l.description;
    document.getElementById('direction-steps').innerHTML=l.directions.map((s,i)=>`
      <div class="direction-step"><div class="step-number">${i+1}</div><div class="step-text">${s}</div></div>`).join('');
    document.getElementById('detail-info').innerHTML=`
      <div class="detail-info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>${l.info}</span></div>
      <div class="detail-info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>${FLOOR_NAMES[l.floor]}</span></div>`;
  },
  closeDetail() {
    document.getElementById('detail-content').style.display='none';
    document.querySelector('.detail-placeholder').style.display='flex';
    this.selectedLocation=null; this.renderLocationList(); this.renderMap();
  },

  zoomIn(){this.zoomLevel=Math.min(this.zoomLevel+0.2,2.5);document.getElementById('school-map').style.transform=`scale(${this.zoomLevel})`},
  zoomOut(){this.zoomLevel=Math.max(this.zoomLevel-0.2,0.5);document.getElementById('school-map').style.transform=`scale(${this.zoomLevel})`},
  resetZoom(){this.zoomLevel=1;document.getElementById('school-map').style.transform='scale(1)'},

  // ===== 3D İZOMETRİK HARİTA =====
  renderMap() {
    const svg=document.getElementById('school-map'), f=this.currentFloor;
    let h=this.svgDefs();
    h+=this.drawIsometricBuilding(f);
    LOCATIONS.filter(l=>l.floor===f).forEach(l=>{
      const sel=this.selectedLocation===l.id;
      h+=this.drawRoom(l,sel);
    });
    if(f===0) h+=this.drawKiosk();
    h+=`<text x="400" y="22" text-anchor="middle" font-size="14" font-weight="800" fill="#1a3a6b" font-family="Inter,sans-serif">${FLOOR_NAMES[f]} — FMV Ispartakule Işık Okulları</text>`;
    h+=`<text x="400" y="38" text-anchor="middle" font-size="8.5" fill="#6b7280" font-family="Inter,sans-serif">${FLOOR_DESC[f]}</text>`;
    svg.innerHTML=h;
  },

  svgDefs(){
    return `<defs>
      <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8ecf1"/><stop offset="100%" stop-color="#d1d5db"/></linearGradient>
      <linearGradient id="gFloor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#eef2f7"/></linearGradient>
      <linearGradient id="gSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>
      <linearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a5d6a7"/><stop offset="100%" stop-color="#66bb6a"/></linearGradient>
      <filter id="sh"><feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.18"/></filter>
      <filter id="shSm"><feDropShadow dx="1" dy="1" stdDeviation="1.5" flood-opacity="0.12"/></filter>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  },

  drawRoom(l,sel){
    const d=8; // 3D depth
    const topColor=sel?'rgba(198,40,40,0.92)':l.color;
    const sideColor=sel?'#a51c1c':this.darken(l.color,30);
    const frontColor=sel?'#b71c1c':this.darken(l.color,15);
    // 3D box: top face
    let s=`<g class="room ${sel?'highlighted':''}" onclick="app.selectLocation('${l.id}')" style="cursor:pointer">`;
    // Front face
    s+=`<rect x="${l.rx}" y="${l.ry+d}" width="${l.rw}" height="${l.rh}" rx="2" fill="${frontColor}" opacity="0.5"/>`;
    // Side face (right)
    s+=`<polygon points="${l.rx+l.rw},${l.ry} ${l.rx+l.rw+d},${l.ry-d} ${l.rx+l.rw+d},${l.ry+l.rh-d} ${l.rx+l.rw},${l.ry+l.rh}" fill="${sideColor}" opacity="0.4"/>`;
    // Top face
    s+=`<rect x="${l.rx}" y="${l.ry}" width="${l.rw}" height="${l.rh}" rx="3" fill="${topColor}" fill-opacity="0.88" stroke="${sel?'#ff1744':'rgba(255,255,255,0.6)'}" stroke-width="${sel?2.5:1}" filter="url(#shSm)"/>`;
    // Text
    const fs=l.rw>110?10:l.rw>80?9:7.5;
    s+=`<text x="${l.rx+l.rw/2}" y="${l.ry+l.rh/2-2}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="600" fill="white" font-family="Inter,sans-serif">${this.trunc(l.name,l.rw>110?22:l.rw>80?16:12)}</text>`;
    s+=`<text x="${l.rx+l.rw/2}" y="${l.ry+l.rh/2+12}" text-anchor="middle" font-size="${l.rh>50?15:12}">${l.icon}</text>`;
    if(sel){
      s+=`<rect x="${l.rx-3}" y="${l.ry-3}" width="${l.rw+6}" height="${l.rh+6}" rx="5" fill="none" stroke="#ff1744" stroke-width="2" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" values="0;-12" dur="1s" repeatCount="indefinite"/></rect>`;
    }
    s+=`</g>`;
    return s;
  },

  drawKiosk(){
    return `<g class="kiosk-marker">
      <circle cx="360" cy="440" r="5" fill="#ff1744"/>
      <circle cx="360" cy="440" r="9" fill="none" stroke="#ff1744" stroke-width="1.5" opacity="0.6"><animate attributeName="r" values="9;16;9" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/></circle>
      <text x="360" y="458" text-anchor="middle" font-size="8" fill="#c62828" font-weight="700" font-family="Inter,sans-serif">📍 Buradasınız</text>
    </g>`;
  },

  drawIsometricBuilding(f){
    let s='';
    const d=10; // 3D depth offset
    // Ground shadow
    s+=`<rect x="72" y="56" width="670" height="410" rx="6" fill="#d1d5db" opacity="0.3" transform="translate(4,4)"/>`;

    // === MAIN BUILDING - L shape ===
    // Top block (sol üst - ana bina)
    s+=`<polygon points="70,200 70,50 540,50 540,200" fill="url(#gFloor)" stroke="#9ca3af" stroke-width="2"/>`;
    // 3D side right
    s+=`<polygon points="540,50 ${540+d},${50-d} ${540+d},${200-d} 540,200" fill="url(#gSide)" stroke="#9ca3af" stroke-width="1"/>`;
    // 3D top
    s+=`<polygon points="70,50 ${70+d},${50-d} ${540+d},${50-d} 540,50" fill="#e2e8f0" stroke="#9ca3af" stroke-width="1"/>`;

    // Left block (sol dikey - yönetim/sınıflar)
    s+=`<polygon points="70,50 70,460 220,460 220,50" fill="url(#gFloor)" stroke="#9ca3af" stroke-width="2"/>`;

    // Right bottom block (sağ alt - sınıflar)
    s+=`<polygon points="220,280 220,460 640,460 640,280" fill="url(#gFloor)" stroke="#9ca3af" stroke-width="2"/>`;
    s+=`<polygon points="640,280 ${640+d},${280-d} ${640+d},${460-d} 640,460" fill="url(#gSide)" stroke="#9ca3af" stroke-width="1"/>`;

    // === KORIDORLAR ===
    s+=`<rect x="72" y="155" width="466" height="22" rx="1" fill="#e9ecef" stroke="#d1d5db" stroke-width="0.5"/>`;
    s+=`<text x="305" y="169" text-anchor="middle" font-size="7" fill="#9ca3af" font-family="Inter,sans-serif" letter-spacing="3">─ ─ ANA KORİDOR ─ ─</text>`;
    s+=`<rect x="176" y="52" width="22" height="406" rx="1" fill="#e9ecef" stroke="#d1d5db" stroke-width="0.5"/>`;
    s+=`<rect x="222" y="310" width="416" height="18" rx="1" fill="#e9ecef" stroke="#d1d5db" stroke-width="0.5"/>`;
    s+=`<rect x="430" y="155" width="18" height="173" rx="1" fill="#e9ecef" stroke="#d1d5db" stroke-width="0.5"/>`;

    // === MERDİVENLER ===
    s+=this.stairs(178,410,'Merdiven A');
    s+=this.stairs(432,135,'Merdiven B');

    // === KAT-OZEL ===
    if(f===0){
      // Teneffüshane
      s+=`<rect x="590" y="55" width="140" height="400" rx="4" fill="url(#gGrass)" stroke="#66bb6a" stroke-width="1.5" stroke-dasharray="5 3"/>`;
      s+=`<text x="660" y="230" text-anchor="middle" font-size="9" fill="#2e7d32" font-weight="700" font-family="Inter,sans-serif" transform="rotate(-90,660,230)">TENEFFÜSHANE</text>`;
      // Ağaçlar
      [{ x:610,y:80},{x:710,y:120},{x:620,y:300},{x:700,y:380},{x:680,y:200}].forEach(t=>{
        s+=`<circle cx="${t.x}" cy="${t.y}" r="${4+Math.random()*3}" fill="#4caf50" opacity="0.5"/>`;
        s+=`<circle cx="${t.x}" cy="${t.y}" r="${2+Math.random()*2}" fill="#66bb6a" opacity="0.7"/>`;
      });
      // Banklar
      s+=`<rect x="640" y="160" width="24" height="4" rx="1.5" fill="#795548"/><rect x="630" y="260" width="24" height="4" rx="1.5" fill="#795548"/>`;
      // Girişler (kapı simgeleri)
      s+=this.entrance(310,448,'LİSE GİRİŞİ','#1b5e20',100);
      s+=this.entrance(560,448,'ORTAOKUL','#1565c0',80);
      // Sağ giriş
      s+=`<rect x="735" y="320" width="10" height="60" rx="2" fill="#00695c" stroke="#004d40" stroke-width="1"/>`;
      s+=`<text x="755" y="355" text-anchor="middle" font-size="6" fill="#00695c" font-weight="700" font-family="Inter,sans-serif" transform="rotate(-90,755,355)">İLKOKUL</text>`;
      s+=`<rect x="735" y="100" width="10" height="50" rx="2" fill="#880e4f" stroke="#6a0039" stroke-width="1"/>`;
      s+=`<text x="755" y="130" text-anchor="middle" font-size="6" fill="#880e4f" font-weight="700" font-family="Inter,sans-serif" transform="rotate(-90,755,130)">ANAOKULU</text>`;
      // Toplanma noktası
      s+=`<rect x="650" y="420" width="60" height="28" rx="3" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1" stroke-dasharray="4 2"/>`;
      s+=`<text x="680" y="437" text-anchor="middle" font-size="6" fill="#2e7d32" font-weight="700">🏁 TOPLANMA</text>`;
    }
    if(f===1){
      s+=this.sectionLabel(75,58,'FEN LİSESİ','#6a1b9a');
      s+=this.sectionLabel(450,285,'LİSE DERSLİKLERİ','#6a1b9a');
    }
    if(f===2){
      s+=this.sectionLabel(75,58,'LABORATUVARLAR','#6a1b9a');
      s+=this.sectionLabel(450,285,'DERSLİKLER','#6a1b9a');
    }
    if(f===-1){
      s+=this.sectionLabel(75,58,'ETKİNLİK & SANAT','#e65100');
      s+=this.sectionLabel(335,58,'SPOR TESİSLERİ','#e65100');
    }

    // Acil çıkışlar
    s+=this.exitSign(542,162);
    s+=this.exitSign(72,340);
    // Yangın söndürücü
    s+=this.fireExt(200,148);
    s+=this.fireExt(420,305);

    return s;
  },

  stairs(x,y,label){
    let s=`<g><rect x="${x}" y="${y}" width="20" height="34" rx="2" fill="#fff8e1" stroke="#ffa000" stroke-width="1.5"/>`;
    for(let i=0;i<5;i++) s+=`<line x1="${x+3}" y1="${y+4+i*6}" x2="${x+17}" y2="${y+4+i*6}" stroke="#ffca28" stroke-width="1.5"/>`;
    s+=`<text x="${x+10}" y="${y+44}" text-anchor="middle" font-size="5.5" fill="#e65100" font-weight="600" font-family="Inter,sans-serif">${label}</text></g>`;
    return s;
  },
  entrance(x,y,label,color,w){
    return `<g><rect x="${x}" y="${y}" width="${w}" height="12" rx="2" fill="${color}" stroke="${color}" stroke-width="1.5"/>
      <text x="${x+w/2}" y="${y+9}" text-anchor="middle" font-size="7" fill="white" font-weight="700" font-family="Inter,sans-serif">🚪 ${label}</text></g>`;
  },
  sectionLabel(x,y,text,color){
    const w=text.length*6+16;
    return `<rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="${color}" opacity="0.12"/><text x="${x+w/2}" y="${y+11}" text-anchor="middle" font-size="7" fill="${color}" font-weight="700" font-family="Inter,sans-serif">${text}</text>`;
  },
  exitSign(x,y){
    return `<g><rect x="${x}" y="${y}" width="30" height="13" rx="2" fill="#d32f2f"/><text x="${x+15}" y="${y+10}" text-anchor="middle" font-size="6" fill="white" font-weight="700">ACİL ▸</text></g>`;
  },
  fireExt(x,y){
    return `<circle cx="${x}" cy="${y}" r="4" fill="#ff5252" opacity="0.7"/><text x="${x}" y="${y+2.5}" text-anchor="middle" font-size="5">🧯</text>`;
  },
  trunc(s,m){return s.length>m?s.substring(0,m-1)+'…':s},
  darken(hex,pct){
    let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    r=Math.max(0,r-pct);g=Math.max(0,g-pct);b=Math.max(0,b-pct);
    return `rgb(${r},${g},${b})`;
  }
};

document.addEventListener('DOMContentLoaded',()=>app.init());
