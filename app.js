(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  
  // 检测并处理 giscus 重定向
  function handleGiscusRedirect() {
    // 检查 URL 是否有 giscus 参数
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('giscus')) {
      // 尝试从 sessionStorage 恢复原 URL
      const savedUrl = window.sessionStorage.getItem('giscus_original_url');
      if (savedUrl) {
        try {
          const savedUrlObj = new URL(savedUrl);
          // 只保留原 URL 的 hash 部分，因为这是我们文档路径
          if (savedUrlObj.hash) {
            // 替换当前 URL，保留 giscus 参数但添加原 hash
            const newUrl = new URL(window.location.href);
            newUrl.hash = savedUrlObj.hash;
            window.history.replaceState(null, '', newUrl.toString());
          }
        } catch (e) {
          console.error('Failed to restore giscus URL:', e);
        }
        // 清理 sessionStorage
        window.sessionStorage.removeItem('giscus_original_url');
      }
    }
  }
  
  async function init() {
    if (window.MarkdownPreview.configLoadPromise) {
      await window.MarkdownPreview.configLoadPromise;
    }
    
    // 首先处理 giscus 重定向
    handleGiscusRedirect();
    
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
