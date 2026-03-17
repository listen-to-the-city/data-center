/* global L */

export function createMap() {
  const map = L.map('map', { zoomControl: false, renderer: L.svg() }).setView([36.3, 127.2], 8);
  // L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  return map;
}

