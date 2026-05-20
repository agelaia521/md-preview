(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  window.MarkdownPreview.search = {};
  
  const { dom, state, fileTree, markdown } = window.MarkdownPreview;
  
  let searchIndex = null;
  let documentCache = new Map();
  let debounceTimer = null;
  
  // 初始化搜索索引
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
  
  // 从文件树构建搜索索引
  async function buildIndexFromFileTree() {
    if (!state.fileTreeData || state.fileTreeData.length === 0) return;
    
    initSearchIndex();
    
    const files = [];
    collectFiles(state.fileTreeData, files);
    
    // 加载所有文件内容并构建索引
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
  
  // 递归收集所有文件
  function collectFiles(items, result) {
    for (const item of items) {
      if (item.type === 'file' && item.name.endsWith('.md')) {
        result.push(item);
      } else if (item.type === 'folder' && item.children) {
        collectFiles(item.children, result);
      }
    }
  }
  
  // 加载并缓存文件
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
  
  // 提取标题
  function extractTitle(content) {
    const frontmatterMatch = content.match(/^---[\s\S]*?title:\s*['"]?(.+?)['"]?\s*(?:\n|---)/i);
    if (frontmatterMatch) return frontmatterMatch[1].trim();
    
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1].trim();
    
    return null;
  }
  
  // 提取预览文本（前200字符）
  function extractPreview(content) {
    let text = content;
    
    // 移除 frontmatter
    text = text.replace(/^---[\s\S]*?---\s*/, '');
    // 移除代码块
    text = text.replace(/```[\s\S]*?```/g, '');
    // 移除标题符号
    text = text.replace(/^#+\s*/gm, '');
    // 移除链接和图片
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '');
    // 移除特殊字符
    text = text.replace(/[*_~`]/g, '');
    // 移除多余空白
    text = text.replace(/\s+/g, ' ').trim();
    
    return text.substring(0, 200);
  }
  
  // 执行搜索
  function performSearch(query) {
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
  
  // 显示搜索结果
  function displaySearchResults(results) {
    const container = dom.searchResults;
    container.innerHTML = '';
    container.classList.add('active');
    
    if (!results || results.length === 0 || !results[0]?.result?.length) {
      container.innerHTML = '<div class="search-no-results">没有找到相关文档</div>';
      return;
    }
    
    // 去重并合并结果
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
    
    // 渲染结果
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
  
  // 隐藏搜索结果
  function hideSearchResults() {
    dom.searchResults.classList.remove('active');
  }
  
  // 转义 HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // 设置搜索事件监听
  function setupSearchEvents() {
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
    
    // 点击其他地方隐藏搜索结果
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
