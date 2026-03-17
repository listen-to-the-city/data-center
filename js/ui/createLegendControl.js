/* global L */

export function createLegendControl({
  categoryGroups,
  colorMap,
  data,
  onToggleType
}) {
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
          onToggleType(type, check.checked);
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

  return legend;
}

