(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  window.MarkdownPreview.search = {};
  
  let searchIndex = null;
  let documents = [];
  let debounceTimer = null;
  let isIndexLoaded = false;
  
  async function loadSearchIndex() {
    try {
      const response = await fetch('search-index.json');
      if (!response.ok) {
        console.warn('Search index not found');
        return [];
      }
      return await response.json();
    } catch (e) {
      console.error('Failed to load search index:', e);
      return [];
    }
  }
  
  function initSearchIndex(indexData) {
    if (searchIndex) return;
    if (!window.FlexSearch) {
      console.error('FlexSearch not loaded!');
      return;
    }
    
    documents = indexData;
    
    searchIndex = new window.FlexSearch({
      tokenize: 'full',
      threshold: 2,
      resolution: 9,
      depth: 3,
      charset: 'latin:extra'
    });
    
    documents.forEach((doc, index) => {
      searchIndex.add(index, doc.title + ' ' + doc.preview);
    });
    
    isIndexLoaded = true;
    console.log('Search index initialized with', documents.length, 'documents');
  }
  
  async function buildIndex() {
    const indexData = await loadSearchIndex();
    initSearchIndex(indexData);
    return indexData.length;
  }
  
  async function ensureIndexLoaded() {
    if (!isIndexLoaded) {
      await buildIndex();
    }
  }
  
  async function performSearch(query) {
    await ensureIndexLoaded();
    
    const { dom } = window.MarkdownPreview;
    if (!searchIndex || !query.trim()) {
      hideSearchResults();
      return;
    }
    
    console.log('Searching for:', query);
    
    const results = searchIndex.search(query, {
      limit: 20
    });
    
    console.log('Search results raw:', results);
    
    displaySearchResults(results);
  }
  
  function displaySearchResults(results) {
    const { dom, fileTree, markdown } = window.MarkdownPreview;
    const container = dom.searchResults;
    container.innerHTML = '';
    container.classList.add('active');
    
    if (!results || results.length === 0) {
      container.innerHTML = '<div class="search-no-results">没有找到相关文档</div>';
      return;
    }
    
    const seen = new Set();
    const merged = [];
    
    for (const index of results) {
      if (seen.has(index)) continue;
      seen.add(index);
      const doc = documents[index];
      if (doc) {
        merged.push(doc);
      }
    }
    
    console.log('Merged results:', merged.length);
    
    if (merged.length === 0) {
      container.innerHTML = '<div class="search-no-results">没有找到相关文档</div>';
      return;
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
  
  function setupSearchEvents() {
    const { dom } = window.MarkdownPreview;
    if (!dom.searchInput) {
      console.error('searchInput not found!');
      return;
    }
    
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
    
    document.addEventListener('click', (e) => {
      if (!dom.searchInput.contains(e.target) && !dom.searchResults.contains(e.target)) {
        hideSearchResults();
      }
    });
  }
  
  function init() {
    setupSearchEvents();
    buildIndex();
  }
  
  window.MarkdownPreview.search = {
    init: init,
    buildIndex: buildIndex
  };
})();
