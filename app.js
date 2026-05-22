(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  
  function init() {
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
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
