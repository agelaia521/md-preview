(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};

  const STORAGE_KEY = 'md-preview-settings';

  const defaultSettings = {
    accentColor: '#d4a5c9',
    accentColor2: '#f2c4ce',
    showComments: true,
    showReadingProgress: true
  };

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return defaultSettings;
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  function applyThemeColors(accentColor, accentColor2) {
    const root = document.documentElement;
    root.style.setProperty('--color-accent-purple', accentColor);
    root.style.setProperty('--color-accent-pink', accentColor2);
    root.style.setProperty('--color-accent-light', `${accentColor}20`);
  }

  function initFloatingMenu() {
    const floatingMenu = document.getElementById('floatingMenu');
    const menuTrigger = document.getElementById('menuTrigger');
    const menuItems = document.querySelector('.menu-items');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const goToCommentsBtn = document.getElementById('goToCommentsBtn');
    const openSettingsBtn = document.getElementById('openSettingsBtn');

    if (!floatingMenu || !menuTrigger || !menuItems) {
      return;
    }

    menuTrigger.addEventListener('click', () => {
      const isOpen = menuItems.classList.contains('open');
      menuItems.classList.toggle('open');
      menuTrigger.classList.toggle('active');
    });

    backToTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      menuItems.classList.remove('open');
      menuTrigger.classList.remove('active');
    });

    goToCommentsBtn?.addEventListener('click', () => {
      const commentsSection = document.getElementById('commentsSection');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
      }
      menuItems.classList.remove('open');
      menuTrigger.classList.remove('active');
    });

    openSettingsBtn?.addEventListener('click', () => {
      openSettingsPanel();
      menuItems.classList.remove('open');
      menuTrigger.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (!floatingMenu.contains(e.target) && menuItems.classList.contains('open')) {
        menuItems.classList.remove('open');
        menuTrigger.classList.remove('active');
      }
    });
  }

  function initSettingsPanel() {
    const settingsOverlay = document.getElementById('settingsOverlay');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const accentColorPicker = document.getElementById('accentColorPicker');
    const accentColor2Picker = document.getElementById('accentColor2Picker');
    const showCommentsToggle = document.getElementById('showCommentsToggle');
    const showReadingProgressToggle = document.getElementById('showReadingProgressToggle');

    if (!settingsOverlay) {
      return;
    }

    closeSettingsBtn?.addEventListener('click', () => {
      closeSettingsPanel();
    });

    settingsOverlay.addEventListener('click', (e) => {
      if (e.target === settingsOverlay) {
        closeSettingsPanel();
      }
    });

    accentColorPicker?.addEventListener('input', (e) => {
      const settings = loadSettings();
      settings.accentColor = e.target.value;
      saveSettings(settings);
      applyThemeColors(settings.accentColor, settings.accentColor2);
    });

    accentColor2Picker?.addEventListener('input', (e) => {
      const settings = loadSettings();
      settings.accentColor2 = e.target.value;
      saveSettings(settings);
      applyThemeColors(settings.accentColor, settings.accentColor2);
    });

    showCommentsToggle?.addEventListener('change', (e) => {
      const settings = loadSettings();
      settings.showComments = e.target.checked;
      saveSettings(settings);
      toggleComments(settings.showComments);
    });

    showReadingProgressToggle?.addEventListener('change', (e) => {
      const settings = loadSettings();
      settings.showReadingProgress = e.target.checked;
      saveSettings(settings);
      toggleReadingProgress(settings.showReadingProgress);
    });
  }

  function openSettingsPanel() {
    const settingsOverlay = document.getElementById('settingsOverlay');
    if (settingsOverlay) {
      settingsOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSettingsPanel() {
    const settingsOverlay = document.getElementById('settingsOverlay');
    if (settingsOverlay) {
      settingsOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function toggleComments(show) {
    const commentsSection = document.getElementById('commentsSection');
    if (commentsSection) {
      commentsSection.style.display = show ? 'block' : 'none';
    }
  }

  function toggleReadingProgress(show) {
    const readingProgress = document.getElementById('readingProgress');
    if (readingProgress) {
      readingProgress.style.display = show ? 'block' : 'none';
    }
  }

  function init() {
    const settings = loadSettings();
    applyThemeColors(settings.accentColor, settings.accentColor2);
    initFloatingMenu();
    initSettingsPanel();
    toggleComments(settings.showComments);
    toggleReadingProgress(settings.showReadingProgress);

    const accentColorPicker = document.getElementById('accentColorPicker');
    const accentColor2Picker = document.getElementById('accentColor2Picker');
    const showCommentsToggle = document.getElementById('showCommentsToggle');
    const showReadingProgressToggle = document.getElementById('showReadingProgressToggle');

    if (accentColorPicker) accentColorPicker.value = settings.accentColor;
    if (accentColor2Picker) accentColor2Picker.value = settings.accentColor2;
    if (showCommentsToggle) showCommentsToggle.checked = settings.showComments;
    if (showReadingProgressToggle) showReadingProgressToggle.checked = settings.showReadingProgress;
  }

  window.MarkdownPreview.settings = {
    load: loadSettings,
    save: saveSettings,
    open: openSettingsPanel,
    close: closeSettingsPanel,
    init: init
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
