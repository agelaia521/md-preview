(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  
  window.MarkdownPreview.state = {
    fileTreeData: [],
    fileLiMap: null,
    currentMode: 'files',
    currentFilePath: '',
    currentHeadings: [],
    currentFrontmatter: {}
  };
})();
