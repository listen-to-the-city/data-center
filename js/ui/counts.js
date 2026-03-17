export function setTotalCount(n) {
  const el = document.getElementById('total-count');
  if (el) el.textContent = String(n);
}

export function setVisibleCount(n) {
  const el = document.getElementById('visible-count');
  if (el) el.textContent = String(n);
}

