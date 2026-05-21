(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  window.MarkdownPreview.search = {};
  
  let searchIndex = null;
  let documentCache = new Map();
  let debounceTimer = null;
  
  function initSearchIndex() {
    if (searchIndex) return;
    
    searchIndex = new FlexSearch.Document({
      tokenize: 'forward',
      cache: 100,
      document: {
        id: 'path',
        index: ['title', 'content'],
        store: ['title', 'path', 'preview']
      }
    });
  }
  
  async function buildIndexFromFileTree() {
    const { state } = window.MarkdownPreview;
    if (!state.fileTreeData || state.fileTreeData.length === 0) return;
    
    initSearchIndex();
    
    const files = [];
    collectFiles(state.fileTreeData, files);
    
    for (const file of files) {
      try {
        const content = await loadAndCacheFile(file.path);
        const title = extractTitle(content) || file.name.replace('.md', '');
        const preview = extractPreview(content);
        
        searchIndex.add({
          path: file.path,
          title: title,
          content: content,
          preview: preview
        });
      } catch (e) {
        console.warn('Failed to index file:', file.path, e);
      }
    }
  }
  
  function collectFiles(items, result) {
    for (const item of items) {
      if (item.type === 'file' && item.name.endsWith('.md')) {
        result.push(item);
      } else if (item.type === 'folder' && item.children) {
        collectFiles(item.children, result);
      }
    }
  }
  
  async function loadAndCacheFile(path) {
    if (documentCache.has(path)) {
      return documentCache.get(path);
    }
    
    const response = await fetch(path);
    if (!response.ok) throw new Error('Failed to load');
    const content = await response.text();
    
    documentCache.set(path, content);
    return content;
  }
  
  function extractTitle(content) {
    const frontmatterMatch = content.match(/^---[\s\S]*?title:\s*['"]?(.+?)['"]?\s*(?:\n|---)/i);
    if (frontmatterMatch) return frontmatterMatch[1].trim();
    
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1].trim();
    
    return null;
  }
  
  function extractPreview(content) {
    let text = content;
    
    text = text.replace(/^---[\s\S]*?---\s*/, '');
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/^#+\s*/gm, '');
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '');
    text = text.replace(/[*_~`]/g, '');
    text = text.replace(/\s+/g, ' ').trim();
    
    return text.substring(0, 200);
  }
  
  function performSearch(query) {
    const { dom } = window.MarkdownPreview;
    if (!searchIndex || !query.trim()) {
      hideSearchResults();
      return;
    }
    
    const results = searchIndex.search(query, {
      limit: 20,
      enrich: true
    });
    
    displaySearchResults(results);
  }
  
  function displaySearchResults(results) {
    const { dom, fileTree, markdown } = window.MarkdownPreview;
    const container = dom.searchResults;
    container.innerHTML = '';
    container.classList.add('active');
    
    if (!results || results.length === 0 || !results[0]?.result?.length) {
      container.innerHTML = '<div class="search-no-results">没有找到相关文档</div>';
      return;
    }
    
    const seen = new Set();
    const merged = [];
    
    for (const resultGroup of results) {
      for (const result of resultGroup.result) {
        if (!seen.has(result.path)) {
          seen.add(result.path);
          merged.push(result);
        }
      }
    }
    
    merged.slice(0, 15).forEach(result => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="search-result-title">${escapeHtml(result.title)}</div>
        <div class="search-result-path">${escapeHtml(result.path)}</div>
        ${result.preview ? `<div class="search-result-preview">${escapeHtml(result.preview)}</div>` : ''}
      `;
      
      item.addEventListener('click', () => {
        markdown.loadMarkdownFile(result.path);
        fileTree.highlightFileInSidebar(result.path);
        hideSearchResults();
        dom.searchInput.value = '';
      });
      
      container.appendChild(item);
    });
  }
  
  function hideSearchResults() {
    const { dom } = window.MarkdownPreview;
    dom.searchResults.classList.remove('active');
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function setupSearchEvents() {
    const { dom } = window.MarkdownPreview;
    if (!dom.searchInput) return;
    
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
    
    dom.searchInput.addEventListener('focus', () => {
      if (!searchIndex) {
        buildIndexFromFileTree();
      }
    });
    
    document.addEventListener('click', (e) => {
      if (!dom.searchInput.contains(e.target) && !dom.searchResults.contains(e.target)) {
        hideSearchResults();
      }
    });
  }
  
  window.MarkdownPreview.search = {
    init: setupSearchEvents,
    buildIndex: buildIndexFromFileTree
  };
})();
