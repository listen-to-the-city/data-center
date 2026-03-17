export function bringDcMarkersToFront({ map, layerGroups }) {
  Object.values(layerGroups).forEach(lg => {
    if (map.hasLayer(lg)) lg.bringToFront();
  });
}

export function setTypeVisible({ map, layerGroups, type, visible }) {
  if (!layerGroups[type]) return;
  if (visible) map.addLayer(layerGroups[type]);
  else map.removeLayer(layerGroups[type]);
}

export function countVisibleMarkers({ map, layerGroups }) {
  let count = 0;
  Object.keys(layerGroups).forEach(type => {
    if (map.hasLayer(layerGroups[type])) {
      count += layerGroups[type].getLayers().length;
    }
  });
  return count;
}

