(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  window.MarkdownPreview.renderers = window.MarkdownPreview.renderers || {};
  
  function render() {
    if (typeof katex === 'undefined' || typeof renderMathInElement === 'undefined') {
      console.error('KaTeX library is not loaded');
      return;
    }
    
    const markdownBody = document.querySelector('.markdown-body');
    if (!markdownBody) return;
    
    try {
      renderMathInElement(markdownBody, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ],
        throwOnError: false,
        macros: {
          "\\f": "#1f(#2)"
        }
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
    }
  }
  
  window.MarkdownPreview.renderers.katex = {
    render
  };
})();
