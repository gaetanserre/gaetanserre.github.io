// Automatically add target="_blank" to all external links

document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('a[href]');
  links.forEach(function (a) {
    const href = a.getAttribute('href') || '';

    if (!href || href.startsWith('mailto:') || href.startsWith('javascript:')) return;
    if (a.classList.contains('ring')) return;

    if (a.hostname !== location.hostname) {
      a.setAttribute('target', '_blank');
    }
  });
});