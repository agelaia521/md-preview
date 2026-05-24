// Theme Manager - 主题管理系统

(function() {
  const STORAGE_KEY = 'md-preview-theme';
  const CUSTOM_CSS_KEY = 'md-preview-custom-css';
  
  // 内置主题列表
  const builtInThemes = [
    {
      id: 'default',
      name: '🌸 紫粉渐变',
      nameEn: 'Purple Pink',
      description: '默认的浅紫浅粉渐变主题',
      preview: 'linear-gradient(135deg, #d4a5c9 0%, #f2c4ce 100%)'
    },
    {
      id: 'github-light',
      name: '⚡ GitHub Light',
      nameEn: 'GitHub Light',
      description: '仿 GitHub 明亮主题',
      preview: 'linear-gradient(135deg, #ffffff 0%, #f6f8fa 100%)'
    },
    {
      id: 'github-dark',
      name: '🌙 GitHub Dark',
      nameEn: 'GitHub Dark',
      description: '仿 GitHub 深色主题',
      preview: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)'
    },
    {
      id: 'notion',
      name: '📝 Notion',
      nameEn: 'Notion Warm',
      description: '仿 Notion 暖灰主题',
      preview: 'linear-gradient(135deg, #f7f6f3 0%, #ffffff 100%)'
    },
    {
      id: 'arc',
      name: '🌈 Arc Dark',
      nameEn: 'Arc Rainbow Purple',
      description: '仿 Arc 浏览器彩虹紫主题',
      preview: 'linear-gradient(135deg, #251e33 0%, #3d3456 100%)'
    },
    {
      id: 'dracula',
      name: '🧛 Dracula',
      nameEn: 'Dracula',
      description: '经典的 Dracula 配色',
      preview: 'linear-gradient(135deg, #44475a 0%, #282a36 100%)'
    },
    {
      id: 'nord',
      name: '❄️ Nord',
      nameEn: 'Nord',
      description: '北极光配色主题',
      preview: 'linear-gradient(135deg, #3b4252 0%, #2e3440 100%)'
    }
  ];

  let currentTheme = 'default';
  let customCSSLink = null;

  // 初始化主题系统
  function init() {
    // 加载保存的主题
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme && builtInThemes.some(t => t.id === savedTheme)) {
      setTheme(savedTheme, false);
    }

    // 加载自定义 CSS
    loadCustomCSS();

    // 创建主题切换器 UI
    createThemeSwitcher();
  }

  // 设置主题
  function setTheme(themeId, save = true) {
    const theme = builtInThemes.find(t => t.id === themeId);
    if (!theme) {
      console.warn(`Theme ${themeId} not found`);
      return;
    }

    currentTheme = themeId;
    document.documentElement.setAttribute('data-theme', themeId);
    
    if (save) {
      localStorage.setItem(STORAGE_KEY, themeId);
    }

    // 触发主题切换事件
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: themeId } }));
    
    console.log(`Theme changed to: ${theme.name}`);
  }

  // 获取当前主题
  function getCurrentTheme() {
    return currentTheme;
  }

  // 获取所有主题
  function getAllThemes() {
    return builtInThemes;
  }

  // 加载自定义 CSS
  function loadCustomCSS(url) {
    // 移除旧的 custom CSS
    if (customCSSLink) {
      customCSSLink.remove();
      customCSSLink = null;
    }

    if (!url) {
      // 从 localStorage 加载
      url = localStorage.getItem(CUSTOM_CSS_KEY);
    }

    if (url) {
      customCSSLink = document.createElement('link');
      customCSSLink.rel = 'stylesheet';
      customCSSLink.href = url;
      document.head.appendChild(customCSSLink);
      console.log(`Custom CSS loaded: ${url}`);
    }
  }

  // 设置自定义 CSS
  function setCustomCSS(url) {
    localStorage.setItem(CUSTOM_CSS_KEY, url);
    loadCustomCSS(url);
  }

  // 清除自定义 CSS
  function clearCustomCSS() {
    localStorage.removeItem(CUSTOM_CSS_KEY);
    if (customCSSLink) {
      customCSSLink.remove();
      customCSSLink = null;
    }
  }

  // 创建主题切换器 UI
  function createThemeSwitcher() {
    // 检查是否已存在
    if (document.getElementById('theme-switcher')) {
      return;
    }

    const switcher = document.createElement('div');
    switcher.id = 'theme-switcher';
    switcher.innerHTML = `
      <div class="theme-switcher-btn" id="themeBtn" title="切换主题">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
      </div>
      <div class="theme-switcher-panel" id="themePanel" style="display: none;">
        <div class="theme-panel-header">
          <h3>选择主题</h3>
          <button class="theme-close-btn" id="themeCloseBtn">×</button>
        </div>
        <div class="theme-list" id="themeList"></div>
        <div class="theme-custom-section">
          <h4>自定义 CSS</h4>
          <div class="theme-custom-input">
            <input type="text" id="customCSSInput" placeholder="输入 CSS 文件 URL" />
            <button id="applyCustomCSS">应用</button>
          </div>
          ${localStorage.getItem(CUSTOM_CSS_KEY) ? '<button class="theme-clear-btn" id="clearCustomCSS">清除自定义样式</button>' : ''}
        </div>
      </div>
    `;

    document.body.appendChild(switcher);

    // 添加样式
    addThemeSwitcherStyles();

    // 渲染主题列表
    renderThemeList();

    // 绑定事件
    bindEvents();
  }

  // 添加主题切换器样式
  function addThemeSwitcherStyles() {
    if (document.getElementById('theme-switcher-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'theme-switcher-styles';
    styles.textContent = `
      #theme-switcher {
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 1000;
        font-family: var(--font-body);
      }

      .theme-switcher-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--color-accent-purple);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px var(--color-hover);
        transition: all 0.3s ease;
      }

      .theme-switcher-btn:hover {
        background: var(--color-accent-purple-deep);
        transform: scale(1.05);
      }

      .theme-switcher-panel {
        position: absolute;
        bottom: 60px;
        left: 0;
        width: 320px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        overflow: hidden;
      }

      .theme-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--color-border);
      }

      .theme-panel-header h3 {
        margin: 0;
        font-size: 16px;
        color: var(--color-text);
      }

      .theme-close-btn {
        background: none;
        border: none;
        font-size: 24px;
        color: var(--color-text-muted);
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }

      .theme-close-btn:hover {
        color: var(--color-text);
      }

      .theme-list {
        max-height: 320px;
        overflow-y: auto;
        padding: 8px;
      }

      .theme-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
        border: 2px solid transparent;
      }

      .theme-item:hover {
        background: var(--color-hover);
      }

      .theme-item.active {
        background: var(--color-hover);
        border-color: var(--color-accent-purple);
      }

      .theme-preview {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        flex-shrink: 0;
        border: 1px solid var(--color-border);
      }

      .theme-info {
        flex: 1;
        min-width: 0;
      }

      .theme-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text);
        margin-bottom: 2px;
      }

      .theme-description {
        font-size: 12px;
        color: var(--color-text-muted);
      }

      .theme-check {
        color: var(--color-accent-purple);
        font-size: 18px;
        display: none;
      }

      .theme-item.active .theme-check {
        display: block;
      }

      .theme-custom-section {
        padding: 16px;
        border-top: 1px solid var(--color-border);
        background: var(--color-bg);
      }

      .theme-custom-section h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: var(--color-text);
      }

      .theme-custom-input {
        display: flex;
        gap: 8px;
      }

      .theme-custom-input input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        font-size: 13px;
        background: var(--color-surface);
        color: var(--color-text);
      }

      .theme-custom-input input:focus {
        outline: none;
        border-color: var(--color-accent-purple);
      }

      .theme-custom-input button {
        padding: 8px 16px;
        background: var(--color-accent-purple);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .theme-custom-input button:hover {
        background: var(--color-accent-purple-deep);
      }

      .theme-clear-btn {
        display: block;
        width: 100%;
        margin-top: 8px;
        padding: 8px;
        background: transparent;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        color: var(--color-text-muted);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .theme-clear-btn:hover {
        border-color: var(--color-error);
        color: var(--color-error);
      }
    `;
    document.head.appendChild(styles);
  }

  // 渲染主题列表
  function renderThemeList() {
    const themeList = document.getElementById('themeList');
    if (!themeList) return;

    themeList.innerHTML = builtInThemes.map(theme => `
      <div class="theme-item ${theme.id === currentTheme ? 'active' : ''}" data-theme="${theme.id}">
        <div class="theme-preview" style="background: ${theme.preview}"></div>
        <div class="theme-info">
          <div class="theme-name">${theme.name}</div>
          <div class="theme-description">${theme.description}</div>
        </div>
        <span class="theme-check">✓</span>
      </div>
    `).join('');
  }

  // 绑定事件
  function bindEvents() {
    const themeBtn = document.getElementById('themeBtn');
    const themePanel = document.getElementById('themePanel');
    const themeCloseBtn = document.getElementById('themeCloseBtn');
    const themeList = document.getElementById('themeList');
    const applyCustomCSSBtn = document.getElementById('applyCustomCSS');
    const customCSSInput = document.getElementById('customCSSInput');
    const clearCustomCSSBtn = document.getElementById('clearCustomCSS');

    // 切换面板显示
    themeBtn.addEventListener('click', () => {
      const isVisible = themePanel.style.display === 'block';
      themePanel.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        renderThemeList(); // 重新渲染以更新选中状态
      }
    });

    // 关闭面板
    themeCloseBtn.addEventListener('click', () => {
      themePanel.style.display = 'none';
    });

    // 点击主题切换
    themeList.addEventListener('click', (e) => {
      const themeItem = e.target.closest('.theme-item');
      if (themeItem) {
        const themeId = themeItem.dataset.theme;
        setTheme(themeId);
        renderThemeList();
      }
    });

    // 应用自定义 CSS
    if (applyCustomCSSBtn) {
      applyCustomCSSBtn.addEventListener('click', () => {
        const url = customCSSInput.value.trim();
        if (url) {
          setCustomCSS(url);
          customCSSInput.value = '';
          // 刷新面板
          themePanel.style.display = 'none';
        }
      });
    }

    // 清除自定义 CSS
    if (clearCustomCSSBtn) {
      clearCustomCSSBtn.addEventListener('click', () => {
        clearCustomCSS();
        // 刷新面板
        themePanel.style.display = 'none';
      });
    }

    // 点击外部关闭面板
    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        themePanel.style.display = 'none';
      }
    });
  }

  // 导出到全局
  window.MarkdownPreview = window.MarkdownPreview || {};
  window.MarkdownPreview.themes = {
    init: init,
    setTheme: setTheme,
    getCurrentTheme: getCurrentTheme,
    getAllThemes: getAllThemes,
    setCustomCSS: setCustomCSS,
    clearCustomCSS: clearCustomCSS
  };

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
