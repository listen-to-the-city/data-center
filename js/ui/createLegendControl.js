/* global L */

export function createLegendControl({
  categoryGroups,
  colorMap,
  data,
  onToggleType
}) {
  const legend = L.control({ position: 'bottomleft' });

  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    function createSection({ headerText, bodyEl, defaultExpanded }) {
      const section = document.createElement('div');
      section.className = 'legend-section';

      const header = document.createElement('div');
      header.className = 'legend-section__header';
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');

      const headerTextEl = document.createElement('span');
      headerTextEl.className = 'legend-section__headerText';
      headerTextEl.textContent = headerText;

      const caret = document.createElement('span');
      caret.className = 'legend-section__caret';
      caret.setAttribute('aria-hidden', 'true');

      header.appendChild(headerTextEl);
      header.appendChild(caret);

      const body = bodyEl;
      body.classList.add('legend-section__body');
      body.hidden = !defaultExpanded;

      if (defaultExpanded) section.classList.remove('legend-section--collapsed');
      else section.classList.add('legend-section--collapsed');

      function toggle() {
        const nextCollapsed = !section.classList.contains('legend-section--collapsed');
        if (nextCollapsed) {
          section.classList.add('legend-section--collapsed');
          body.hidden = true;
          header.setAttribute('aria-expanded', 'false');
        } else {
          section.classList.remove('legend-section--collapsed');
          body.hidden = false;
          header.setAttribute('aria-expanded', 'true');
        }
      }

      if (isMobile) {
        header.addEventListener('click', toggle);
        header.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        });
        header.setAttribute('aria-expanded', defaultExpanded ? 'true' : 'false');
      } else {
        header.setAttribute('aria-expanded', 'true');
      }

      section.appendChild(header);
      section.appendChild(body);
      return section;
    }

    const dcBody = document.createElement('div');
    dcBody.className = 'legend-section__content';

    for (const [group, types] of Object.entries(categoryGroups)) {
      const groupEl = document.createElement('div');
      groupEl.className = 'legend-group';
      groupEl.appendChild(document.createTextNode(group));

      const itemsWrap = document.createElement('div');
      itemsWrap.className = 'legend-items';

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
        itemsWrap.appendChild(row);
      });

      groupEl.appendChild(itemsWrap);
      dcBody.appendChild(groupEl);
    }

    const dcSection = createSection({
      headerText: 'Data center type',
      bodyEl: dcBody,
      defaultExpanded: true
    });

    const droughtBody = document.createElement('div');
    droughtBody.className = 'drought-legend';
    droughtBody.innerHTML =
      '<div class="drought-item"><i style="background:rgba(255,80,50,0.6)"></i><span>Caution</span></div>' +
      '<div class="drought-item"><i style="background:rgba(255,200,50,0.5)"></i><span>Watch</span></div>' +
      '<div class="drought-item"><i style="background:rgba(100,200,100,0.15)"></i><span>Normal</span></div>';

    const droughtSection = createSection({
      headerText: 'Drought status',
      bodyEl: droughtBody,
      defaultExpanded: true
    });

    div.appendChild(dcSection);
    div.appendChild(droughtSection);

    return div;
  };

  return legend;
}

