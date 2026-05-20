(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  
  const { markdown, fileTree, state } = window.MarkdownPreview;
  
  let isUpdating = false;
  
  function initRouter() {
    window.addEventListener('hashchange', handleHashChange);
    loadFromHash();
  }
  
  function loadFromHash() {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    
    // 支持两种格式：#/path/to/file.md 或 #path/to/file.md
    let path = decodeURIComponent(hash.substring(1));
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    
    if (path && path.endsWith('.md')) {
      isUpdating = true;
      markdown.loadMarkdownFile(path);
      fileTree.highlightFileInSidebar(path);
      setTimeout(() => isUpdating = false, 100);
    }
  }
  
  function handleHashChange() {
    if (isUpdating) return;
    loadFromHash();
  }
  
  function updateHash(path) {
    if (!path || isUpdating) return;
    const hash = '#/' + encodeURIComponent(path);
    if (window.location.hash !== hash) {
      isUpdating = true;
      window.history.replaceState(null, '', hash);
      setTimeout(() => isUpdating = false, 100);
    }
  }
  
  window.MarkdownPreview.router = {
    init: initRouter,
    updateHash
  };
})();
