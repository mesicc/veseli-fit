/* ============================================================
   Coach Veseli – main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. THEME TOGGLE ── */
  var html              = document.documentElement;
  var themeToggle       = document.getElementById('themeToggle');
  var themeToggleMobile = document.getElementById('themeToggleMobile');
  var iconSun           = document.getElementById('iconSun');
  var iconMoon          = document.getElementById('iconMoon');
  var iconSunMobile     = document.getElementById('iconSunMobile');
  var iconMoonMobile    = document.getElementById('iconMoonMobile');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('veseli-theme', theme);
    var isDark = theme === 'dark';
    iconSun.classList.toggle('hidden', !isDark);
    iconMoon.classList.toggle('hidden', isDark);
    iconSunMobile.classList.toggle('hidden', !isDark);
    iconMoonMobile.classList.toggle('hidden', isDark);
  }

  function toggleTheme() {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  setTheme(localStorage.getItem('veseli-theme') || 'dark');
  themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile.addEventListener('click', toggleTheme);


  /* ── 2. MOBILE MENU ── */
  var mobileMenu  = document.getElementById('mobileMenu');
  var menuOpen    = document.getElementById('menuOpen');
  var menuClose   = document.getElementById('menuClose');
  var mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    menuOpen.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    menuOpen.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  menuOpen.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* ── 3. AKTIVAN LINK PREMA URL-u ── */
  var currentPath = window.location.pathname;
  var allLinks    = document.querySelectorAll('.nav-links a, .mobile-link');

  // Mapiranje stranica na href vrijednosti
  var pageMap = {
    '/':            '#pocetna',
    '/index.html':  '#pocetna',
    '/programi/index.html':    '#programi',
    '/o-meni/index.html':      '#moja-prica',
    '/kontakt/index.html':     '#kontakt',
  };

  var activeHref = pageMap[currentPath];

  if (activeHref) {
    allLinks.forEach(function (link) {
      if (link.getAttribute('href') === activeHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  // Ako nema podudaranja, ostavi active klase iz HTML-a

});