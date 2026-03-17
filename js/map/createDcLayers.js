/* global L */

export function createDcLayers({ map, data, colorMap, sizeMap }) {
  const markers = [];
  const layerGroups = {};

  function applyNeonGlow(marker, glowColor) {
    const el = marker.getElement?.();
    if (!el) return;
    el.style.setProperty('--dc-glow', glowColor);
    el.classList.add('dc-marker--glow');
  }

  function createDcPopupContent(d, color) {
    const root = document.createElement('div');
    root.className = 'dc-popup';

    const title = document.createElement('div');
    title.className = 'dc-popup__title';
    title.textContent = d.name || '';
    root.appendChild(title);

    if (d.address) {
      const addr = document.createElement('div');
      addr.className = 'dc-popup__address';
      addr.textContent = d.address;
      root.appendChild(addr);
    }


    const meta = document.createElement('div');
    meta.className = 'dc-popup__meta';

    const addLine = (label, value) => {
      if (!value) return;
      const line = document.createElement('div');
      line.className = 'dc-popup__line';
      line.innerHTML = `<span class="dc-popup__label">${label}</span> ${value}`;
      meta.appendChild(line);
    };

    addLine('Operator:', d.operator);
    addLine('Year:', d.year);
    if (d.size) addLine('Area:', `${Number(d.size).toLocaleString()} m²`);
    addLine('IT capacity:', d.it_cap ? `${d.it_cap} MW` : '');
    addLine('PUE:', d.pue);
    addLine('Cooling:', d.cooling);

    if (meta.childNodes.length) root.appendChild(meta);

    const badge = document.createElement('div');
    badge.className = 'dc-popup__badge';
    badge.style.setProperty('--badge', color);
    if (['#a2fc4d', '#ffc233'].includes(color)) badge.classList.add('dc-popup__badge--dark');
    badge.textContent = d.type || '';
    root.appendChild(badge);

    return root;
  }

  Object.keys(colorMap).forEach(type => {
    layerGroups[type] = L.layerGroup().addTo(map);
  });

  data.forEach(d => {
    if (!d.lat || !d.lon) return;
    const color = colorMap[d.type] || '#999';
    const size = 6;

    const marker = L.circleMarker([d.lat, d.lon], {
      radius: size,
      fillColor: color,
      color: 'transparent',
      weight: 0,
      opacity: 1,
      fillOpacity: 0.85,
      className: 'dc-marker'
    });

    marker.on('add', () => applyNeonGlow(marker, color));
    marker.bindPopup(createDcPopupContent(d, color));
    marker.dcData = d;
    markers.push(marker);

    if (layerGroups[d.type]) {
      layerGroups[d.type].addLayer(marker);
    }
  });

  return { markers, layerGroups };
}

