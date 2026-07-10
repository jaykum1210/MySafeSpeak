// MySafeSpeak — shared/common scripts.
// Holds JS that is either duplicated across multiple pages (settings-page
// theme picker) or belongs to the general public pages that aren't part of
// any single role area (landing, login, signup).
// Depends on assets/js/theme.js being loaded first (uses window.__theme).

/* ---------------------------------------------------------------
 * Responsive hamburger menu — sidebar shell (dashboard-style pages).
 * Injects a hamburger button into the topbar and a backdrop, then
 * toggles a `.nav-open` class on `.shell` so components/responsive.css
 * can slide the sidebar in/out as an off-canvas panel on tablet and
 * mobile widths. No-op on pages without a `.shell`/`.sidebar`/`.topbar`
 * (i.e. anything outside the admin/manager/investigator/reporter areas).
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  var shell = document.querySelector('.shell');
  var sidebar = document.querySelector('.sidebar');
  var topbar = document.querySelector('.topbar');
  if (!shell || !sidebar || !topbar) return;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'hamburger-btn';
  btn.setAttribute('aria-label', 'Toggle navigation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  topbar.insertBefore(btn, topbar.firstChild);

  var backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  shell.appendChild(backdrop);

  function closeNav(){
    shell.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function toggleNav(){
    var open = shell.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  btn.addEventListener('click', toggleNav);
  backdrop.addEventListener('click', closeNav);
  sidebar.querySelectorAll('.item').forEach(function(item){
    item.addEventListener('click', closeNav);
  });
});

/* ---------------------------------------------------------------
 * Responsive hamburger menu — public site nav (landing page).
 * Injects a hamburger button that toggles the .nav-links dropdown
 * on mobile. No-op on pages without a `.site-nav`.
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  var bar = document.querySelector('.site-nav .bar');
  var links = document.querySelector('.nav-links');
  if (!bar || !links) return;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-hamburger-btn';
  btn.setAttribute('aria-label', 'Toggle navigation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  bar.insertBefore(btn, links);

  btn.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
});

/* ---------------------------------------------------------------
 * Settings pages — theme picker card selection.
 * Was duplicated identically across reporter/settings.html,
 * manager/manager-settings.html, investigator/investigator-settings.html
 * and admin/admin-settings.html.
 * ------------------------------------------------------------- */

// reflect the theme that's actually active (set from the landing page
// or a previous visit here) rather than always defaulting to "Light"
document.addEventListener('DOMContentLoaded', function(){
  var current = window.__theme ? window.__theme.get() : 'light';
  document.querySelectorAll('.theme-card').forEach(function(c){
    c.classList.toggle('selected', c.classList.contains(current));
  });
});
document.querySelectorAll('.theme-card').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('.theme-card').forEach(x => x.classList.remove('selected'));
  c.classList.add('selected');
}));

/* ---------------------------------------------------------------
 * Landing page — keep the sun/moon theme-switch icon in sync.
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  var sync = function(){
    var isDark = window.__theme && window.__theme.get() === 'dark';
    var l = document.querySelector('.ts-light');
    var d = document.querySelector('.ts-dark');
    if (l && d) { l.classList.toggle('on', !isDark); d.classList.toggle('on', isDark); }
  };
  sync();
  var btn = document.querySelector('.theme-switch');
  if (btn) { btn.addEventListener('click', function(){ setTimeout(sync, 0); }); }
});

/* ---------------------------------------------------------------
 * Login page.
 * ------------------------------------------------------------- */
var ROLE_DASHBOARDS = {
  reporter:     { label: 'Reporter',     href: 'reporter/reporter-dashboard.html' },
  investigator: { label: 'Investigator', href: 'investigator/investigator-dashboard.html' },
  manager:      { label: 'Manager',      href: 'manager/manager-dashboard.html' },
  admin:        { label: 'Admin',        href: 'admin/admin-dashboard.html' }
};

function loginShowStep(n){
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');
}

function handleLogin(){
  loginShowStep(2);
}

function completeLogin(){
  var role = document.getElementById('login-role').value;
  var meta = ROLE_DASHBOARDS[role] || ROLE_DASHBOARDS.reporter;
  document.getElementById('login-success-note').textContent = 'Verified. Redirecting to your ' + meta.label + ' Dashboard…';
  document.getElementById('login-dashboard-link').setAttribute('href', meta.href);
  document.getElementById('login-dashboard-link').textContent = 'Go to ' + meta.label + ' dashboard →';
  loginShowStep(3);
}

/* ---------------------------------------------------------------
 * Signup page.
 * ------------------------------------------------------------- */
var ROLE_META = {
  investigator: {
    label: 'Investigator',
    successSub: 'Your Investigator account is pending Admin approval.',
    successNote: 'An Admin needs to verify your invite code and department before your account is activated. You\'ll get an email once it\'s approved.'
  },
  manager: {
    label: 'Manager',
    successSub: 'Your Manager account is pending Admin approval.',
    successNote: 'An Admin needs to verify your invite code and department before your account is activated. You\'ll get an email once it\'s approved.'
  },
  admin: {
    label: 'Admin',
    successSub: 'Your Admin account request is pending review.',
    successNote: 'New Admin accounts can\'t self-activate — this request goes to an existing Admin to confirm your invite code before you get system access. You\'ll get an email once it\'s approved.'
  }
};

function chooseRole(role){
  document.getElementById('step-role').classList.remove('active');

  if (role === 'reporter') {
    document.getElementById('progress-staff').classList.add('hidden');
    document.getElementById('progress-reporter').classList.remove('hidden');
    signupShowStep('reporter', 1);
    return;
  }

  var meta = ROLE_META[role];
  document.getElementById('role-chip-label').textContent = meta.label;
  document.getElementById('staff-success-sub').textContent = meta.successSub;
  document.getElementById('staff-success-note').textContent = meta.successNote;
  document.getElementById('brand-h1').textContent = 'Staff accounts stay accountable, not anonymous.';
  document.getElementById('brand-p').textContent = 'Unlike reporter accounts, staff roles are tied to your name and department — because investigators, managers, and admins act on reports, they need to be identifiable.';

  document.getElementById('progress-reporter').classList.add('hidden');
  document.getElementById('progress-staff').classList.remove('hidden');
  signupShowStep('staff', 1);
}

function backToRoles(){
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('progress-reporter').classList.add('hidden');
  document.getElementById('progress-staff').classList.add('hidden');
  document.getElementById('step-role').classList.add('active');
}

function signupShowStep(flow, n){
  var prefix = flow === 'reporter' ? 'r' : 's';
  var progressPrefix = flow === 'reporter' ? 'rp' : 'sp';

  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + prefix + n).classList.add('active');

  var progress = document.getElementById('progress-' + flow);
  progress.querySelectorAll('.seg').forEach(s => s.classList.remove('current', 'done'));
  for (var i = 1; i <= 3; i++) {
    var seg = document.getElementById(progressPrefix + i);
    if (!seg) continue;
    if (i < n) seg.classList.add('done');
    if (i === n) seg.classList.add('current');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
