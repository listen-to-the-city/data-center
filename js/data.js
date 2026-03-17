export function loadDcData(typeTranslate) {
  const data = Array.isArray(window.DC_DATA) ? window.DC_DATA : [];
  data.forEach(d => {
    if (typeTranslate[d.type]) d.type = typeTranslate[d.type];
  });
  return data;
}

export function loadDroughtData() {
  return window.DROUGHT_DATA || null;
}

