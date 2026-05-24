(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  
  // 立即检测并处理 giscus 重定向，在任何其他代码执行前
  (function handleGiscusRedirectImmediately() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('giscus')) {
      const savedUrl = window.sessionStorage.getItem('giscus_original_url');
      if (savedUrl) {
        try {
          const savedUrlObj = new URL(savedUrl);
          if (savedUrlObj.hash) {
            // 完全替换为原 URL，但保留 giscus 查询参数让 giscus 处理
            const newUrl = new URL(savedUrlObj.href);
            newUrl.search = window.location.search;
            window.history.replaceState(null, '', newUrl.toString());
            console.log('Restored URL hash from giscus redirect:', newUrl.toString());
          }
        } catch (e) {
          console.error('Failed to restore giscus URL:', e);
        }
        // 不立即清理，以防需要多次处理
      }
    }
  })();
  
  async function init() {
    if (window.MarkdownPreview.configLoadPromise) {
      await window.MarkdownPreview.configLoadPromise;
    }
    
    window.MarkdownPreview.fileTree.loadFileTree();
    window.MarkdownPreview.ui.setupEventListeners();
    window.MarkdownPreview.ui.setupScrollProgress();
    if (window.MarkdownPreview.search && window.MarkdownPreview.search.init) {
      window.MarkdownPreview.search.init();
    }
    if (window.MarkdownPreview.router && window.MarkdownPreview.router.init) {
      window.MarkdownPreview.router.init();
    }
    if (window.MarkdownPreview.debug && window.MarkdownPreview.debug.init) {
      window.MarkdownPreview.debug.init();
    }
    if (window.MarkdownPreview.plugins && window.MarkdownPreview.plugins.autoLoad) {
      await window.MarkdownPreview.plugins.autoLoad();
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
