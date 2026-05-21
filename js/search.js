(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  window.MarkdownPreview.search = {};
  
  let searchIndex = null;
  let debounceTimer = null;
  
  async function loadSearchIndex() {
    try {
      const response = await fetch('search-index.json');
      if (!response.ok) {
        console.warn('Search index not found, using fallback');
        return [];
      }
      return await response.json();
    } catch (e) {
      console.warn('Failed to load search index:', e);
      return [];
    }
  }
  
  function initSearchIndex(indexData) {
    if (searchIndex) return;
    
    searchIndex = new FlexSearch.Document({
      tokenize: 'forward',
      cache: 100,
      document: {
        id: 'path',
        index: ['title', 'preview'],
        store: ['title', 'path', 'preview']
      }
    });
    
    for (const item of indexData) {
      searchIndex.add({
        path: item.path,
        title: item.title,
        preview: item.preview
      });
    }
  }
  
  async function buildIndex() {
    const indexData = await loadSearchIndex();
    initSearchIndex(indexData);
    return indexData.length;
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
        markdown.loadMarkdownFile('docs/' + result.path);
        fileTree.highlightFileInSidebar('docs/' + result.path);
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
  
  async function setupSearchEvents() {
    const { dom } = window.MarkdownPreview;
    if (!dom.searchInput) return;
    
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
    
    dom.searchInput.addEventListener('focus', async () => {
      if (!searchIndex) {
        const count = await buildIndex();
        console.log(`Search index loaded: ${count} documents`);
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
    buildIndex: buildIndex
  };
})();
