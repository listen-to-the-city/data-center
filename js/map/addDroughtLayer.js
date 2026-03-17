/* global L */

export function addDroughtLayer(map, droughtData) {
  if (!droughtData) return null;

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

  function createDroughtPopupContent(p) {
    const step = p.DRGHT_STEP;
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

    const root = document.createElement('div');
    root.className = 'drought-popup';
    // root.style.setProperty('--badge', stepColor[step] || '#666');

    const title = document.createElement('div');
    title.className = 'drought-popup__title';
    title.textContent = `${p.SGG_NM}, ${p.SD_NM}`;
    root.appendChild(title);

    const badge = document.createElement('div');
    badge.className = 'drought-popup__badge';
    badge.style.setProperty('--badge', stepColor[step] || '#666');
    if (step === '관심') badge.classList.add('drought-popup__badge--dark');
    badge.textContent = `${step} (${stepEN[step] || ''})`;
    root.appendChild(badge);


    return root;
  }

  return L.geoJSON(droughtData, {
    style: function (feature) {
      const step = feature.properties.DRGHT_STEP;
      return {
        fillColor: droughtColors[step] || 'transparent',
        fillOpacity: 1,
        color: droughtBorders[step] || 'rgba(255,255,255,0.05)',
        weight: step === '정상' ? 0.6 : 0.7,
        opacity: 1
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(createDroughtPopupContent(feature.properties));
    }
  }).addTo(map);
}

