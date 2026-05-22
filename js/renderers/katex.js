(function() {
  window.MarkdownPreview = window.MarkdownPreview || {};
  window.MarkdownPreview.renderers = window.MarkdownPreview.renderers || {};
  
  function unescapeHtml(text) {
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#92;': '\\',
      '&#0092;': '\\'
    };
    return text.replace(/&(?:amp|lt|gt|quot|#39|#x27|#x2F|#92|#0092);/g, match => entities[match] || match);
  }
  
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
          {left: '$', right: '$', display: false},
          {left: '\\[', right: '\\]', display: true},
          {left: '\\(', right: '\\)', display: false}
        ],
        ignoredTags: [
          'script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'
        ],
        throwOnError: false,
        trust: true,
        strict: false,
        macros: {
          '\\f': '#1f(#2)',
          '\\bm': '\\boldsymbol{#1}',
          '\\dif': '\\mathrm{d}',
          '\\pdif': '\\partial'
        }
      });
      
      document.querySelectorAll('.katex-block').forEach(block => {
        let latex = block.textContent;
        latex = unescapeHtml(latex);
        if (latex && !block.querySelector('.katex')) {
          try {
            katex.render(latex, block, {
              displayMode: true,
              throwOnError: false,
              trust: true,
              strict: false
            });
          } catch (e) {
            console.error('KaTeX block rendering error:', e);
          }
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
