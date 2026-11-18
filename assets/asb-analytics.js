/* Arcade Side B: optional first-party consent control for Google Analytics. */
(function () {
  'use strict';
  var id = 'G-V9S211X1J2', key = 'asb-analytics-choice-v1', loaded = false;
  var choice = null;
  try {
    var saved = JSON.parse(localStorage.getItem(key));
    if (saved && Date.now() - saved.time < 180 * 86400000) choice = saved.value;
  } catch (e) {}
  window['ga-disable-' + id] = choice !== 'allow';
  function start() {
    if (loaded) return;
    loaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: 'arcadesideb.com',
      page_location: location.origin + location.pathname
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function clearCookies() {
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        ['', '; domain=arcadesideb.com', '; domain=.arcadesideb.com'].forEach(function (domain) {
          document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax';
        });
      }
    });
  }
  function choose(value) {
    choice = value;
    try { localStorage.setItem(key, JSON.stringify({ value: value, time: Date.now() })); } catch (e) {}
    if (value === 'allow') start();
    else {
      window['ga-disable-' + id] = true;
      clearCookies();
    }
    panel.hidden = true;
    settings.textContent = 'Analytics settings (' + (value === 'allow' ? 'on' : 'off') + ')';
    settings.focus();
    // Unload already-running measurement listeners when consent is withdrawn.
    if (value === 'deny' && loaded) location.reload();
  }
  var style = document.createElement('style');
  style.textContent = '#asb-privacy-controls{box-sizing:border-box;width:calc(100% - 32px);max-width:1160px;margin:12px auto;padding:8px 0;border-top:1px solid #293543;color:#aeb8be;background:transparent;font:12px/1.5 Arial,sans-serif;text-align:left;display:flex;align-items:center;flex-wrap:wrap;gap:6px 12px}#asb-privacy-controls p{margin:0;flex:1 1 260px;font:inherit;color:inherit}#asb-privacy-controls>div{display:flex;align-items:center;flex-wrap:wrap;gap:6px 8px;width:100%}#asb-privacy-controls button,#asb-privacy-controls a{font:inherit;color:#dce2e5}#asb-privacy-controls button{display:inline-block;cursor:pointer;background:#17222c;border:1px solid #52616b;border-radius:4px;padding:5px 9px;margin:0;min-height:32px}#asb-privacy-controls>a{padding:5px 0}#asb-privacy-controls a{text-decoration:underline}#asb-privacy-controls button:focus-visible,#asb-privacy-controls a:focus-visible{outline:3px solid #f0c57e;outline-offset:3px}#asb-privacy-controls [hidden]{display:none!important}';
  document.head.appendChild(style);
  var wrap = document.createElement('section');
  wrap.id = 'asb-privacy-controls';
  wrap.setAttribute('aria-label', 'Privacy and analytics');
  var settings = document.createElement('button');
  settings.type = 'button';
  settings.textContent = 'Analytics settings' + (choice ? ' (' + (choice === 'allow' ? 'on' : 'off') + ')' : '');
  var policy = document.createElement('a');
  policy.href = '/privacy.html';
  policy.textContent = 'Privacy notice';
  var panel = document.createElement('div');
  panel.hidden = choice === 'allow' || choice === 'deny';
  var info = document.createElement('p');
  info.textContent = 'Optional analytics cookies help us measure visits. Off unless you allow them.';
  var allow = document.createElement('button'), deny = document.createElement('button');
  allow.type = deny.type = 'button';
  allow.textContent = 'Allow analytics';
  deny.textContent = 'No thanks';
  allow.addEventListener('click', function () { choose('allow'); });
  deny.addEventListener('click', function () { choose('deny'); });
  settings.addEventListener('click', function () { panel.hidden = !panel.hidden; if (!panel.hidden) allow.focus(); });
  panel.append(info, allow, deny);
  wrap.append(panel, settings, policy);
  document.body.appendChild(wrap);
  if (choice === 'allow') start();
})();
