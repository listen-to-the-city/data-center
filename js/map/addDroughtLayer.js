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

  return L.geoJSON(droughtData, {
    style: function (feature) {
      const step = feature.properties.DRGHT_STEP;
      return {
        fillColor: droughtColors[step] || 'transparent',
        fillOpacity: 1,
        color: droughtBorders[step] || 'rgba(255,255,255,0.05)',
        weight: step === '정상' ? 0.3 : 0.7,
        opacity: 1
      };
    },
    onEachFeature: function (feature, layer) {
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

