/* global L */

export function createDcLayers({ map, data, colorMap, sizeMap }) {
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

  return { markers, layerGroups };
}

