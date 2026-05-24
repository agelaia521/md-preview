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
      console.log('[Mermaid] mermaidCode length:', mermaidCode.length);
      console.log('[Mermaid] pre element parent:', pre.parentElement ? pre.parentElement.tagName : 'no parent');
      
      try {
        const { svg } = await mermaid.render(id, mermaidCode);
        console.log('[Mermaid] SVG generated, length:', svg ? svg.length : 0);
        console.log('[Mermaid] SVG first 100 chars:', svg ? svg.substring(0, 100) : 'no SVG');
        
        if (!svg || svg.length === 0) {
          console.error('[Mermaid] SVG is empty!');
          continue;
        }
        
        const container = document.createElement('div');
        container.className = 'mermaid-diagram';
        container.innerHTML = svg;
        
        console.log('[Mermaid] container.innerHTML set, checking...');
        console.log('[Mermaid] container children count:', container.children.length);
        console.log('[Mermaid] container.firstChild:', container.firstChild ? container.firstChild.tagName : 'none');
        
        // 使用 parentNode.replaceChild 方法，这更可靠
        if (pre.parentNode) {
          console.log('[Mermaid] Replacing pre with container using parentNode.replaceChild');
          pre.parentNode.replaceChild(container, pre);
          
          // 验证替换是否成功
          const isPreStillThere = document.body.contains(pre);
          const isContainerThere = document.body.contains(container);
          console.log('[Mermaid] Pre still in DOM:', isPreStillThere);
          console.log('[Mermaid] Container in DOM:', isContainerThere);
          
          if (!isPreStillThere && isContainerThere) {
            console.log('[Mermaid] ✅ Successfully replaced pre with SVG container');
          } else {
            console.error('[Mermaid] ❌ Replacement failed!');
          }
        } else {
          console.error('[Mermaid] pre has no parentNode, cannot replace');
        }
      } catch (error) {
        console.error('[Mermaid] Rendering error:', error);
        console.error('[Mermaid] Error stack:', error.stack);
        
        const errorDiv = document.createElement('div');
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.padding = '10px';
        errorDiv.style.border = '1px solid #ff6b6b';
        errorDiv.style.borderRadius = '4px';
        errorDiv.textContent = 'Mermaid 渲染错误: ' + error.message;
        
        if (pre.parentNode) {
          pre.parentNode.replaceChild(errorDiv, pre);
        }
      }
    }
  }

  window.MarkdownPreview.renderers.mermaid = {
    render
  };
  
  console.log('[Mermaid] Renderer module loaded and registered');
})();
