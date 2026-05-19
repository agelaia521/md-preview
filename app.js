(function() {
  const fileTree = document.getElementById('fileTree');
  const markdownContent = document.getElementById('markdownContent');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const progressBar = document.getElementById('progressBar');
  const readingProgressBar = document.querySelector('.reading-progress-bar');
  
  const CONFIG = {
    owner: 'theforeveriris',
    repo: 'md-preview'
  };
  
  let fileTreeData = [];
  
  function init() {
    loadFileTree();
    setupEventListeners();
    setupScrollProgress();
  }
  
  async function loadFileTree() {
    try {
      const apiUrl = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/git/trees/main?recursive=1`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file tree from GitHub API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      fileTreeData = buildTreeFromFlatList(data.tree);
      renderFileTree(fileTreeData);
    } catch (error) {
      console.error('Error loading file tree:', error);
      fileTree.innerHTML = '<div class="file-item" style="color: var(--color-text-muted);">无法加载文件列表，请检查网络或手动配置</div>';
    }
  }
  
  function buildTreeFromFlatList(tree) {
    const root = [];
    const map = {};
    
    tree.forEach(item => {
      if (item.type === 'blob' && item.path.endsWith('.md')) {
        const parts = item.path.split('/');
        let currentLevel = root;
        let pathSoFar = '';
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (i === parts.length - 1) {
            currentLevel.push({
              name: part,
              type: 'file',
              path: item.path
            });
          } else {
            pathSoFar = pathSoFar ? `${pathSoFar}/${part}`.replace(/^\//, '');
            let existingFolder = map[pathSoFar];
            if (!existingFolder) {
              existingFolder = {
                name: part,
                type: 'folder',
                children: []
              };
              map[pathSoFar] = existingFolder;
              currentLevel.push(existingFolder);
            }
            currentLevel = existingFolder.children;
          }
        }
      }
    });
    
    function sortTree(items) {
      items.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      
      items.forEach(item => {
        if (item.type === 'folder' && item.children) {
          sortTree(item.children);
        }
      });
    }
    sortTree(root);
    return root;
  }
  
  function renderFileTree(files, container = fileTree, level = 0) {
    files.forEach((item, index) => {
      if (item.type === 'folder') {
        const folderEl = document.createElement('div');
        folderEl.className = 'folder-item';
        folderEl.innerHTML = `
          <svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span>${item.name}</span>
        `;
        
        const childrenEl = document.createElement('div');
        childrenEl.className = 'folder-children';
        
        folderEl.addEventListener('click', () => {
          folderEl.classList.toggle('expanded');
          childrenEl.classList.toggle('expanded');
        });
        
        container.appendChild(folderEl);
        renderFileTree(item.children || [], childrenEl, level + 1);
        container.appendChild(childrenEl);
        
        if (level === 0) {
          childrenEl.classList.add('expanded');
          folderEl.classList.add('expanded');
        }
      } else if (item.type === 'file' && item.name.endsWith('.md')) {
        const fileEl = document.createElement('a');
        fileEl.className = 'file-item';
        fileEl.href = '#';
        fileEl.textContent = item.name.replace('.md', '');
        fileEl.dataset.path = item.path;
        
        fileEl.addEventListener('click', (e) => {
          e.preventDefault();
          loadMarkdownFile(item.path);
          setActiveFile(fileEl);
          closeSidebarOnMobile();
        });
        
        container.appendChild(fileEl);
      }
    });
  }
  
  function setActiveFile(fileEl) {
    document.querySelectorAll('.file-item.active').forEach(el => {
      el.classList.remove('active');
    });
    fileEl.classList.add('active');
  }
  
  async function loadMarkdownFile(path) {
    try {
      updateProgress(30);
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Failed to load markdown file');
      }
      updateProgress(60);
      const markdown = await response.text();
      updateProgress(100);
      renderMarkdown(markdown);
    } catch (error) {
      console.error('Error loading markdown:', error);
      markdownContent.innerHTML = '<div class="welcome-state"><p class="welcome-text">无法加载文件</p></div>';
      setTimeout(() => updateProgress(0), 500);
    }
  }
  
  function renderMarkdown(markdown) {
    const html = marked.parse(markdown, {
      breaks: true,
      gfm: true
    });
    markdownContent.innerHTML = html;
    
    document.querySelectorAll('.markdown-body pre').forEach(pre => {
      pre.addEventListener('click', () => {
        copyCodeToClipboard(pre);
      });
    });
  }
  
  function copyCodeToClipboard(pre) {
    const code = pre.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.textContent).then(() => {
        const originalText = code.textContent;
        code.textContent = 'Copied!';
        setTimeout(() => {
          code.textContent = originalText;
        }, 1500);
      });
    }
  }
  
  function updateProgress(percent) {
    progressBar.style.width = percent + '%';
    if (percent === 100) {
      setTimeout(() => {
        progressBar.style.width = '0%';
      }, 300);
    }
  }
  
  function setupScrollProgress() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      readingProgressBar.style.width = scrollPercent + '%';
    });
  }
  
  function setupEventListeners() {
    sidebarToggle.addEventListener('click', toggleSidebarDesktop);
    mobileMenuBtn.addEventListener('click', toggleSidebarMobile);
    sidebarOverlay.addEventListener('click', closeSidebar);
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    });
  }
  
  function toggleSidebarDesktop() {
    sidebar.classList.toggle('collapsed');
  }
  
  function toggleSidebarMobile() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  }
  
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebar.classList.remove('collapsed');
    sidebarOverlay.classList.remove('active');
  }
  
  function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();