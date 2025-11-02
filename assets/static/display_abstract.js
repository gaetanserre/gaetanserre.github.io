function toggleDivVisibility(id) {
  const el = document.getElementById(id);
  if (!el || el.tagName !== 'DIV') return;

  const isHidden = getComputedStyle(el).display === 'none';
  el.style.display = isHidden ? 'block' : 'none';
}
