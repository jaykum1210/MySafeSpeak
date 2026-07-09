// MySafeSpeak — shared light/dark theme controller.
// Persists the choice across page navigation using a URL parameter
// (?theme=dark) rather than browser storage. Link rewriting is done
// with plain string edits (not the URL object) so relative paths are
// never rewritten into absolute ones — that was breaking navigation.
(function () {
  function getTheme() {
    return new URLSearchParams(window.location.search).get('theme') === 'dark' ? 'dark' : 'light';
  }

  // Adds/removes ?theme=dark from a path string without touching
  // anything else about it (no base-URL resolution involved at all).
  function withTheme(href, theme) {
    var hashIdx = href.indexOf('#');
    var hash = hashIdx >= 0 ? href.slice(hashIdx) : '';
    var main = hashIdx >= 0 ? href.slice(0, hashIdx) : href;

    var qIdx = main.indexOf('?');
    var path = qIdx >= 0 ? main.slice(0, qIdx) : main;
    var query = qIdx >= 0 ? main.slice(qIdx + 1) : '';

    var params = new URLSearchParams(query);
    if (theme === 'dark') { params.set('theme', 'dark'); } else { params.delete('theme'); }
    var qs = params.toString();

    return path + (qs ? '?' + qs : '') + hash;
  }

  function isRewritable(href) {
    if (!href) return false;
    if (href.charAt(0) === '#') return false;
    if (href.indexOf('mailto:') === 0) return false;
    if (/^https?:\/\//i.test(href)) return false;
    return true;
  }

  function rewriteLinksAndForms(theme) {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!isRewritable(href)) return;
      a.setAttribute('href', withTheme(href, theme));
    });
    document.querySelectorAll('form[action]').forEach(function (f) {
      var action = f.getAttribute('action');
      if (!action || !isRewritable(action)) return;
      f.setAttribute('action', withTheme(action, theme));
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    rewriteLinksAndForms(theme);
  }

  function setTheme(theme) {
    theme = theme === 'dark' ? 'dark' : 'light';
    applyTheme(theme);
    try {
      var newUrl = withTheme(window.location.pathname + window.location.search + window.location.hash, theme);
      window.history.replaceState(null, '', newUrl);
    } catch (e) { /* non-fatal */ }
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  window.__theme = { get: getTheme, apply: applyTheme, set: setTheme, toggle: toggleTheme };

  // Apply immediately (don't wait for DOMContentLoaded) so there's no
  // flash of the wrong theme, then rewrite links once the DOM exists.
  document.documentElement.setAttribute('data-theme', getTheme());
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getTheme());
  });
})();
