# 插件开发指南

Markdown Preview 的插件系统让你可以轻松扩展渲染器，添加新的功能。

## 插件基础

每个插件是一个 ES 模块，需要导出一个包含以下属性的对象：

```javascript
export default {
  name: 'my-plugin',              // 插件名称（唯一标识符）
  description: '我的插件描述',      // （可选）插件描述

  // 测试函数：判断是否应该处理这个代码块
  test(code, language) {
    return language === 'my-language';
  },

  // 渲染函数：实际渲染内容
  render(code, container) {
    // 在这里实现你的渲染逻辑
    container.innerHTML = 'Hello!';
  }
};
```

## 插件示例

让我们创建一个简单的插件，它可以渲染彩虹文本：

### 步骤1: 创建插件文件

在 `plugins/` 目录下创建 `rainbow-text.js`：

```javascript
export default {
  name: 'rainbow-text',
  description: '渲染彩虹文本',

  test(code, language) {
    // 当语言是 rainbow 时触发
    return language === 'rainbow';
  },

  render(code, container) {
    // 清理容器
    container.innerHTML = '';
    container.style.textAlign = 'center';
    container.style.padding = '20px';
    container.style.fontSize = '24px';
    container.style.fontWeight = 'bold';

    // 创建带颜色的 span
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8f00ff'];

    code.trim().split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.style.color = colors[i % colors.length];
      span.textContent = char;
      container.appendChild(span);
    });
  }
};
```

### 步骤2: 使用插件

在你的 Markdown 文件中使用 ````rainbow` 语言代码块：

```markdown
# 彩虹文本演示

```rainbow
Hello, Markdown Preview!
```
```

## test 函数详解

`test` 函数用于判断插件是否应该处理某个代码块。

### 仅基于语言判断

```javascript
test(code, language) {
  return language === 'mermaid';
}
```

### 基于内容判断

```javascript
test(code, language) {
  try {
    const json = JSON.parse(code);
    return json.type === 'chart';
  } catch {
    return false;
  }
}
```

### 结合语言和内容

```javascript
test(code, language) {
  if (language !== 'json') return false;
  
  try {
    const json = JSON.parse(code);
    return json.chartType !== undefined;
  } catch {
    return false;
  }
}
```

## render 函数详解

`render` 函数负责实际渲染，它接收两个参数：

| 参数 | 类型 | 描述 |
|------|------|------|
| code | string | 代码块的原始内容 |
| container | HTMLElement | 要渲染到的 DOM 元素 |

### 渲染最佳实践

1. **始终清空容器**：
```javascript
render(code, container) {
  container.innerHTML = '';
  // 你的代码
}
```

2. **保持样式一致**：
```javascript
render(code, container) {
  container.style.background = 'var(--color-surface)';
  container.style.borderRadius = '8px';
  container.style.padding = '16px';
  // ...
}
```

3. **处理错误**：
```javascript
render(code, container) {
  try {
    // 你的渲染逻辑
  } catch (err) {
    container.textContent = `渲染错误: ${err.message}`;
    container.style.color = 'var(--color-error)';
  }
}
```

## 插件 API

Markdown Preview 提供了全局 API，可以通过 `window.MarkdownPreview` 访问。

### 主题信息

```javascript
const theme = window.MarkdownPreview.themes.getCurrentTheme();
console.log(theme); // "default", "github-dark" 等
```

### 监听主题变化

```javascript
window.addEventListener('themechange', (e) => {
  console.log('主题已改变:', e.detail.theme);
  // 更新插件渲染
});
```

## 加载外部资源

如果你的插件需要外部库（如 Mermaid），建议按需加载：

```javascript
async render(code, container) {
  // 检查库是否已加载
  if (!window.mermaid) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    window.mermaid.initialize();
  }

  // 然后渲染...
}
```

## 插件清单

如果你想让插件被自动发现，可以更新 `plugins/manifest.json`（可选）：

```json
{
  "plugins": [
    {
      "name": "rainbow-text",
      "path": "plugins/rainbow-text.js"
    }
  ]
}
```

## 插件示例参考

查看项目中的示例插件：
- [qrcode.js](../plugins/qrcode.js) - 二维码生成插件

## 测试你的插件

1. 启动本地开发服务器
2. 在 Markdown 文件中使用你的插件
3. 检查浏览器控制台是否有错误

## 常见问题

### Q: 插件没生效？

A: 检查以下几点：
- 插件文件是否在 `plugins/` 目录下？
- `test` 函数是否正确返回 true？
- 浏览器控制台是否有错误？

### Q: 如何使用 CSS 变量？

A: 使用 `var(--color-xxx)` 语法，会自动适配主题：

```javascript
container.style.color = 'var(--color-text)';
container.style.background = 'var(--color-surface)';
```

### Q: 插件能访问文档内容吗？

A: 插件只负责处理单个代码块，如需访问其他内容，需要通过 DOM 操作。
