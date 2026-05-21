(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  
  const { markdown, fileTree, state } = window.MarkdownPreview;
  
  let isUpdating = false;
  let pendingHash = null;
  
  function initRouter() {
    window.addEventListener('hashchange', handleHashChange);
    // 检查是否有需要加载的 hash
    if (window.location.hash && window.location.hash.length > 2) {
      pendingHash = window.location.hash;
    }
  }
  
  // 文件树加载完成后调用此函数
  function onFileTreeLoaded() {
    if (pendingHash) {
      loadFromHash(pendingHash);
      pendingHash = null;
    } else {
      loadFromHash();
    }
  }
  
  function loadFromHash(hash = null) {
    const targetHash = hash || window.location.hash;
    if (!targetHash || targetHash.length < 2) return;
    
    // 支持两种格式：#/path/to/file.md 或 #path/to/file.md
    let path = decodeURIComponent(targetHash.substring(1));
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    
    if (path && path.endsWith('.md')) {
      isUpdating = true;
      markdown.loadMarkdownFile(path).catch(() => {
        console.warn('Failed to load document from URL');
      });
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
    const hash = '#/' + path;
    if (window.location.hash !== hash) {
      isUpdating = true;
      window.history.replaceState(null, '', hash);
      setTimeout(() => isUpdating = false, 100);
    }
  }
  
  window.MarkdownPreview.router = {
    init: initRouter,
    updateHash,
    onFileTreeLoaded
  };
})();
