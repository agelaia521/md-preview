(function() {
  console.log('[Mermaid] Renderer module loading...');
  window.MarkdownPreview = window.MarkdownPreview || {};
  window.MarkdownPreview.renderers = window.MarkdownPreview.renderers || {};

  async function render() {
    console.log('[Mermaid] render() called');
    
    if (typeof mermaid === 'undefined') {
      console.error('[Mermaid] Library is not loaded');
      return;
    }

    const allPres = document.querySelectorAll('.markdown-body pre');
    console.log('[Mermaid] Found pre elements:', allPres.length);

    // 从后往前遍历，防止替换元素导致索引失效
    for (let i = allPres.length - 1; i >= 0; i--) {
      const pre = allPres[i];
      const codeElement = pre.querySelector('code');

      if (!codeElement) {
        console.log('[Mermaid] No codeElement found, skipping');
        continue;
      }

      const classList = codeElement.className;
      console.log('[Mermaid] codeElement classList:', classList);
      
      if (!classList || !classList.includes('language-mermaid')) {
        console.log('[Mermaid] Not a mermaid code block, skipping');
        continue;
      }

      const mermaidCode = codeElement.textContent.trim();
      const id = 'mermaid-' + Date.now() + '-' + i;

      console.log('[Mermaid] Found mermaid code block, rendering with id:', id);
      
      try {
        const { svg } = await mermaid.render(id, mermaidCode);
        const container = document.createElement('div');
        container.className = 'mermaid-diagram';
        container.innerHTML = svg;
        pre.replaceWith(container);
        console.log('[Mermaid] Successfully rendered mermaid diagram');
      } catch (error) {
        console.error('[Mermaid] Rendering error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.padding = '10px';
        errorDiv.style.border = '1px solid #ff6b6b';
        errorDiv.style.borderRadius = '4px';
        errorDiv.textContent = 'Mermaid 渲染错误: ' + error.message;
        pre.replaceWith(errorDiv);
      }
    }
  }

  window.MarkdownPreview.renderers.mermaid = {
    render
  };
  
  console.log('[Mermaid] Renderer module loaded and registered');
})();
