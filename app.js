/* global L */

const colorMap = {
  'Hyperscale': '#a2fc4d',
  'Commercial colo': '#e84dc4',
  'AI / Cloud': '#8e3ce1',
  'Telecom IDC': '#ff6b35',
  'Pipeline': '#ffc233',
  'Enterprise': '#45b7d1',
  'Gov integrated': '#2563eb',
  'Gov agency': '#3b82f6',
  'Municipal': '#64748b'
};

const sizeMap = {
  'Hyperscale': 11,
  'Commercial colo': 9,
  'AI / Cloud': 10,
  'Telecom IDC': 9,
  'Pipeline': 8,
  'Enterprise': 8,
  'Gov integrated': 9,
  'Gov agency': 7,
  'Municipal': 6
};

const categoryGroups = {
  'Cloud / AI infrastructure': ['Hyperscale', 'Commercial colo', 'AI / Cloud'],
  'Telecom / network': ['Telecom IDC', 'Pipeline'],
  'Enterprise / public': ['Enterprise', 'Gov integrated', 'Gov agency', 'Municipal']
};

const typeTranslate = {
  '하이퍼스케일': 'Hyperscale',
  '상업용 코로': 'Commercial colo',
  'AI/클라우드': 'AI / Cloud',
  '통신사 IDC': 'Telecom IDC',
  '파이프라인': 'Pipeline',
  '기업 자사용': 'Enterprise',
  '공공 통합전산': 'Gov integrated',
  '공공기관 자사': 'Gov agency',
  '지자체 전산': 'Municipal'
};

const data = Array.isArray(window.DC_DATA) ? window.DC_DATA : [];
data.forEach(d => {
  if (typeTranslate[d.type]) d.type = typeTranslate[d.type];
});

const droughtData = window.DROUGHT_DATA;

const totalCountEl = document.getElementById('total-count');
if (totalCountEl) totalCountEl.textContent = String(data.length);

const map = L.map('map', { zoomControl: false }).setView([36.3, 127.8], 7);
L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  maxZoom: 19
}).addTo(map);

// ── Drought Layer ──
const droughtColors = {
  '정상': 'rgba(100,200,100,0.08)',
  '관심': 'rgba(255,200,50,0.35)',
  '주의': 'rgba(255,80,50,0.45)'
};
const droughtBorders = {
  '정상': 'rgba(150,200,150,0.15)',
  '관심': 'rgba(255,200,50,0.6)',
  '주의': 'rgba(255,80,50,0.7)'
};

if (droughtData) {
  L.geoJSON(droughtData, {
    style: function(feature) {
      const step = feature.properties.DRGHT_STEP;
      return {
        fillColor: droughtColors[step] || 'transparent',
        fillOpacity: 1,
        color: droughtBorders[step] || 'rgba(255,255,255,0.05)',
        weight: step === '정상' ? 0.3 : 1.5,
        opacity: 1
      };
    },
    onEachFeature: function(feature, layer) {
      const p = feature.properties;
      const stepColor = {
        '정상': '#66cc66',
        '관심': '#ffcc33',
        '주의': '#ff5533'
      };
      const stepEN = {
        '정상': 'Normal',
        '관심': 'Watch',
        '주의': 'Caution'
      };
      layer.bindPopup(
        '<div style="font-family:\'Apple SD Gothic Neo\',sans-serif;background:#1a1a1a;color:#eee;min-width:160px">' +
        '<div style="font-size:13px;font-weight:700">' + p.SGG_NM + ', ' + p.SD_NM + '</div>' +
        '<div style="margin-top:4px"><span style="display:inline-block;background:' + (stepColor[p.DRGHT_STEP] || '#666') + ';color:' + (p.DRGHT_STEP === '관심' ? '#333' : '#fff') + ';padding:2px 10px;border-radius:10px;font-size:11px">' + p.DRGHT_STEP + ' (' + (stepEN[p.DRGHT_STEP] || '') + ')</span></div>' +
        '<div style="font-size:10px;color:#888;margin-top:3px">Date: ' + p.ANALS_DE + '</div></div>'
      );
    }
  }).addTo(map);
}

// Ensure DC markers are on top
const markers = [];
const layerGroups = {};

Object.keys(colorMap).forEach(type => {
  layerGroups[type] = L.layerGroup().addTo(map);
});

data.forEach(d => {
  if (!d.lat || !d.lon) return;
  const color = colorMap[d.type] || '#999';
  const size = sizeMap[d.type] || 6;

  const marker = L.circleMarker([d.lat, d.lon], {
    radius: size,
    fillColor: color,
    color: 'transparent',
    weight: 0,
    opacity: 1,
    fillOpacity: 0.85
  });

  let popup = `<div style="font-family:'Apple SD Gothic Neo',sans-serif;min-width:200px;background:#1a1a1a;color:#eee">`;
  popup += `<div style="font-size:14px;font-weight:700;margin-bottom:4px;color:#fff">${d.name}</div>`;
  popup += `<div style="display:inline-block;background:${color};color:${['#a2fc4d', '#ffc233'].includes(color) ? '#333' : '#fff'};padding:2px 8px;border-radius:10px;font-size:10px;margin-bottom:6px">${d.type}</div>`;
  if (d.operator) popup += `<div style="font-size:11px;color:#aaa">Operator: ${d.operator}</div>`;
  if (d.year) popup += `<div style="font-size:11px;color:#aaa">Year: ${d.year}</div>`;
  if (d.size) popup += `<div style="font-size:11px;color:#aaa">Area: ${Number(d.size).toLocaleString()} m²</div>`;
  if (d.it_cap) popup += `<div style="font-size:11px;color:#aaa">IT capacity: ${d.it_cap} MW</div>`;
  if (d.pue) popup += `<div style="font-size:11px;color:#aaa">PUE: ${d.pue}</div>`;
  if (d.cooling) popup += `<div style="font-size:11px;color:#aaa">Cooling: ${d.cooling}</div>`;
  popup += `<div style="font-size:10px;color:#777;margin-top:4px">${d.address}</div>`;
  popup += `</div>`;

  marker.bindPopup(popup);
  marker.dcData = d;
  markers.push(marker);

  if (layerGroups[d.type]) {
    layerGroups[d.type].addLayer(marker);
  }
});

// Legend
const legend = L.control({ position: 'bottomleft' });
legend.onAdd = function() {
  const div = L.DomUtil.create('div', 'legend');
  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);

  const title = document.createElement('h4');
  title.textContent = 'Data center type';
  div.appendChild(title);

  for (const [group, types] of Object.entries(categoryGroups)) {
    const groupEl = document.createElement('div');
    groupEl.className = 'legend-group';
    groupEl.textContent = group;
    div.appendChild(groupEl);

    types.forEach(type => {
      const count = data.filter(d => d.type === type).length;
      const row = document.createElement('label');
      row.className = 'legend-item';

      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = true;
      check.className = 'legend-check';
      check.dataset.type = type;
      check.style.setProperty('--c', colorMap[type]);

      const text = document.createElement('span');
      text.className = 'legend-text';
      text.textContent = `${type} (${count})`;

      check.addEventListener('change', () => {
        setTypeVisible(type, check.checked);
      });

      row.appendChild(check);
      row.appendChild(text);
      div.appendChild(row);
    });
  }

  const droughtWrap = document.createElement('div');
  droughtWrap.className = 'drought-legend';
  droughtWrap.innerHTML =
    '<h4>Drought status (2026.03.15)</h4>' +
    '<div><i style="background:rgba(255,80,50,0.6)"></i><span>Caution</span></div>' +
    '<div><i style="background:rgba(255,200,50,0.5)"></i><span>Watch</span></div>' +
    '<div><i style="background:rgba(100,200,100,0.15)"></i><span>Normal</span></div>';
  div.appendChild(droughtWrap);
  return div;
};
legend.addTo(map);

function setTypeVisible(type, visible) {
  if (!layerGroups[type]) return;
  if (visible) {
    map.addLayer(layerGroups[type]);
  } else {
    map.removeLayer(layerGroups[type]);
  }
  updateCount();
  bringDcMarkersToFront();
}

function updateCount() {
  let count = 0;
  Object.keys(layerGroups).forEach(type => {
    if (map.hasLayer(layerGroups[type])) {
      count += layerGroups[type].getLayers().length;
    }
  });
  const visibleCountEl = document.getElementById('visible-count');
  if (visibleCountEl) visibleCountEl.textContent = String(count);
}

updateCount();

function bringDcMarkersToFront() {
  Object.values(layerGroups).forEach(lg => {
    if (map.hasLayer(lg)) lg.bringToFront();
  });
}

bringDcMarkersToFront();
map.on('overlayadd', bringDcMarkersToFront);

