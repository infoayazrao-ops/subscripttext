/**
 * Shared site chrome: theme toggle + header dropdowns.
 * Loaded on all pages. Converter logic lives in script.js (homepage only).
 */
(function () {
  'use strict';

  var THEME_KEY = 'subscript-generator-theme';

  function getTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return 'dark';
  }

  function setTheme(theme) {
    var b = document.body;
    if (!b) return;
    if (theme === 'light') {
      b.classList.remove('dark');
      b.classList.add('light');
      try { localStorage.setItem(THEME_KEY, 'light'); } catch (e) {}
    } else {
      b.classList.add('dark');
      b.classList.remove('light');
      try { localStorage.setItem(THEME_KEY, 'dark'); } catch (e) {}
    }
    var label = document.getElementById('themeLabel');
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }

  function initTheme() {
    setTheme(getTheme());
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var isLight = document.body.classList.contains('light');
        setTheme(isLight ? 'dark' : 'light');
      });
    }
  }

  function initDropdowns() {
    var dropdownToggles = document.querySelectorAll('.topbar-dropdown-toggle');
    if (!dropdownToggles.length) return;
    dropdownToggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var parent = btn.closest('.topbar-dropdown');
        if (!parent) return;
        var isOpen = parent.classList.contains('open');
        document.querySelectorAll('.topbar-dropdown.open').forEach(function (d) {
          if (d !== parent) d.classList.remove('open');
        });
        if (!isOpen) parent.classList.add('open');
        else parent.classList.remove('open');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.topbar-dropdown')) {
        document.querySelectorAll('.topbar-dropdown.open').forEach(function (d) {
          d.classList.remove('open');
        });
      }
    });
  }

  function init() {
    initTheme();
    initDropdowns();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
