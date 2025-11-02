// Automatically add target="_blank" to all external links

$(document).ready(function () {
  $.expr[':'].external = function (obj) {
    return !obj.href.match(/^mailto\:/)
      && (obj.hostname != location.hostname)
      && !obj.href.match(/^javascript\:/)
      && !obj.href.match(/^$/)
      && !obj.classList.contains("ring")
  };

  $('a:external').attr('target', '_blank');
});