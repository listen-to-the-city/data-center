/* global L */

import { categoryGroups, colorMap, sizeMap, typeTranslate } from './config.js';
import { loadDcData, loadDroughtData } from './data.js';
import { createMap } from './map/createMap.js';
import { addDroughtLayer } from './map/addDroughtLayer.js';
import { createDcLayers } from './map/createDcLayers.js';
import { bringDcMarkersToFront, countVisibleMarkers, setTypeVisible } from './map/visibility.js';
import { createLegendControl } from './ui/createLegendControl.js';
import { setTotalCount, setVisibleCount } from './ui/counts.js';

if (!window.L) {
  throw new Error('Leaflet (L) is not loaded. Check script order in index.html.');
}

const data = loadDcData(typeTranslate);
const droughtData = loadDroughtData();

setTotalCount(data.length);

const map = createMap();

addDroughtLayer(map, droughtData);

const { layerGroups } = createDcLayers({
  map,
  data,
  colorMap,
  sizeMap
});

function updateVisible() {
  setVisibleCount(countVisibleMarkers({ map, layerGroups }));
}

function handleToggleType(type, visible) {
  setTypeVisible({ map, layerGroups, type, visible });
  updateVisible();
  bringDcMarkersToFront({ map, layerGroups });
}

const legend = createLegendControl({
  categoryGroups,
  colorMap,
  data,
  onToggleType: handleToggleType
});
legend.addTo(map);

updateVisible();
bringDcMarkersToFront({ map, layerGroups });
map.on('overlayadd', () => bringDcMarkersToFront({ map, layerGroups }));

