(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  
  const DEFAULT_CONFIG = {
    owner: 'theforeveriris',
    repo: 'md-preview',
    giscus: {
      enabled: true,
      repo: 'theforeveriris/md-preview',
      repoId: 'R_kgDOShdDkQ',
      category: 'Announcements',
      categoryId: 'DIC_kwDOShdDkc4C9g0r',
      mapping: 'term',
      strict: '1',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      lang: 'zh-CN',
      loading: 'lazy'
    }
  };
  
  window.MarkdownPreview.CONFIG = { ...DEFAULT_CONFIG };
  
  window.MarkdownPreview.configLoaded = false;
  window.MarkdownPreview.configLoadPromise = null;
  
  async function loadConfig() {
    try {
      const response = await fetch('config.json');
      if (response.ok) {
        const externalConfig = await response.json();
        window.MarkdownPreview.CONFIG = mergeDeep(DEFAULT_CONFIG, externalConfig);
        console.log('[Config] Loaded external config.json');
      } else {
        console.log('[Config] config.json not found, using defaults');
      }
    } catch (error) {
      console.log('[Config] Failed to load config.json, using defaults:', error);
    }
    window.MarkdownPreview.configLoaded = true;
  }
  
  function mergeDeep(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = mergeDeep(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  
  window.MarkdownPreview.loadConfig = loadConfig;
  window.MarkdownPreview.configLoadPromise = loadConfig();
})();
