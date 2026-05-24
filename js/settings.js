(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};

  const STORAGE_KEY = 'md-preview-settings';

  const defaultSettings = {
    showComments: true,
    showReadingProgress: true
  };

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, showComments: parsed.showComments ?? defaultSettings.showComments, showReadingProgress: parsed.showReadingProgress ?? defaultSettings.showReadingProgress };
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
  
  function downloadCurrentFile(format) {
    const { state } = window.MarkdownPreview;
    const currentPath = state.currentFilePath;
    
    if (!currentPath) {
      alert('请先打开一个文档');
      return;
    }
    
    const fileName = currentPath.split('/').pop().replace('.md', '');
    
    if (format === 'md') {
      downloadMarkdown(currentPath, fileName);
    } else if (format === 'pdf') {
      downloadPDF(fileName);
    }
  }
  
  async function downloadMarkdown(path, fileName) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const content = await response.text();
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请重试');
    }
  }
  
  function downloadPDF(fileName) {
    const markdownContent = document.getElementById('markdownContent');
    if (!markdownContent) {
      alert('无法获取文档内容');
      return;
    }
    
    const header = document.querySelector('.page-header');
    const nav = document.querySelector('.doc-navigation');
    const comments = document.getElementById('commentsSection');
    
    if (header) header.style.display = 'none';
    if (nav) nav.style.display = 'none';
    if (comments) comments.style.display = 'none';
    
    const originalTitle = document.title;
    document.title = fileName;
    
    const printContent = document.getElementById('markdownContent').innerHTML;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('请允许弹出窗口以生成 PDF');
      if (header) header.style.display = '';
      if (nav) nav.style.display = '';
      if (comments) comments.style.display = '';
      document.title = originalTitle;
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${fileName}</title>
        <link rel="stylesheet" href="styles.css">
        <link rel="stylesheet" href="css/themes/themes.css">
        <style>
          body {
            font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
          h1 { font-size: 2em; border-bottom: 2px solid #d4a5c9; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.2em; }
          pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
          code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: 'SF Mono', Consolas, monospace; }
          pre code { background: none; padding: 0; }
          blockquote { border-left: 4px solid #d4a5c9; margin: 1em 0; padding-left: 1em; color: #666; }
          img { max-width: 100%; height: auto; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
          th { background: #f6f8fa; }
          @media print {
            body { margin: 0; padding: 20px; }
            .geo-map { height: 300px !important; page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      if (header) header.style.display = '';
      if (nav) nav.style.display = '';
      if (comments) comments.style.display = '';
      document.title = originalTitle;
    }, 500);
  }
  
  function initDownloadButtons() {
    const downloadMdBtn = document.getElementById('downloadMdBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    downloadMdBtn?.addEventListener('click', () => downloadCurrentFile('md'));
    downloadPdfBtn?.addEventListener('click', () => downloadCurrentFile('pdf'));
  }

  function init() {
    const settings = loadSettings();
    initFloatingMenu();
    initSettingsPanel();
    initDownloadButtons();
    toggleComments(settings.showComments);
    toggleReadingProgress(settings.showReadingProgress);

    const showCommentsToggle = document.getElementById('showCommentsToggle');
    const showReadingProgressToggle = document.getElementById('showReadingProgressToggle');

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
