/*!
 * One-click language switch.
 *
 * The Chinese site is generated at / and the English site at /en/ with the
 * same permalinks, so the counterpart of any page is just the same path with
 * the /en prefix added or removed.
 */
(function () {
  var EN_PREFIX = '/en/';
  var path = location.pathname;

  var isEN = path === '/en' || path.indexOf(EN_PREFIX) === 0;
  var target;
  var label;
  var title;

  if (isEN) {
    target = path === '/en' ? '/' : path.slice('/en'.length);
    if (!target) target = '/';
    label = '中文';
    title = '切换到中文版';
  } else {
    target = path === '/' || path === '/index.html' ? '/en/' : '/en' + path;
    label = 'EN';
    title = 'Switch to English';
  }

  target += location.search + location.hash;

  // Typed subtitle lines, per language. The theme's config only supplies an
  // empty placeholder; Hexo deep-merges config arrays by concatenation, so the
  // lines are kept here instead of duplicating them in the theme config.
  var SUBTITLES = {
    zh: ['在坚冰还盖着北海的时候', '我看到了怒放的梅花'],
    en: ['While the northern sea was still under ice', 'I saw the plum blossoms blazing']
  };

  var CSS = [
    '#lang-switch{',
    'display:inline-flex;align-items:center;justify-content:center;',
    'min-width:2.1rem;height:1.65rem;margin:0 .2rem 0 .6rem;padding:0 .55rem;',
    'border:1px solid currentColor;border-radius:999px;',
    'font-size:.78rem;font-weight:600;line-height:1;letter-spacing:.02em;',
    'opacity:.7;text-decoration:none;transition:opacity .2s,color .2s,border-color .2s;',
    '}',
    '#lang-switch:hover{opacity:1;color:var(--theme-color,#49b1f5);border-color:var(--theme-color,#49b1f5);}',
    '@media screen and (max-width:768px){#lang-switch{height:1.5rem;min-width:1.9rem;padding:0 .45rem;}}'
  ].join('');

  // Feed the typed.js subtitle the lines of the current language.
  function patchSubtitle() {
    var fn = window.typedJSFn;
    if (!fn || fn.__langPatched) return;
    var originalInit = fn.init;
    fn.init = function () {
      return originalInit.call(this, SUBTITLES[isEN ? 'en' : 'zh']);
    };
    fn.__langPatched = true;
  }

  function init() {
    var menus = document.getElementById('menus');
    patchSubtitle();
    if (!menus) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var link = document.createElement('a');
    link.id = 'lang-switch';
    link.className = 'site-page';
    link.href = target;
    link.textContent = label;
    link.title = title;
    link.setAttribute('hreflang', isEN ? 'zh-CN' : 'en');
    link.setAttribute('rel', 'alternate');
    menus.insertBefore(link, menus.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
