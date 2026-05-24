# 主题定制指南

Markdown Preview 使用 CSS 变量实现主题系统，非常容易扩展和自定义。

## CSS 变量系统

所有颜色都定义为 CSS 变量，你可以轻松覆盖它们。

### 颜色变量

| 变量名 | 描述 |
|--------|------|
| `--color-bg` | 背景色 |
| `--color-surface` | 表面/卡片背景色 |
| `--color-border` | 边框色 |
| `--color-text` | 文本颜色 |
| `--color-text-muted` | 次要文本颜色 |
| `--color-accent-purple` | 主强调色（紫色） |
| `--color-accent-pink` | 次要强调色（粉色） |
| `--color-hover` | 悬停背景色 |
| `--color-selection` | 文本选择背景色 |
| `--color-link` | 链接颜色 |
| `--color-success` | 成功提示色 |
| `--color-error` | 错误提示色 |
| `--color-warning` | 警告提示色 |

## 创建自定义主题

### 方法1：创建主题文件

创建一个 CSS 文件，定义自己的主题：

```css
/* my-theme.css */

[data-theme="my-theme"] {
  /* 基础颜色 */
  --color-bg: #fdfdfd;
  --color-surface: #ffffff;
  --color-border: #e0e0e0;
  --color-text: #333333;
  --color-text-muted: #999999;
  
  /* 强调色 */
  --color-accent-purple: #6366f1;
  --color-accent-pink: #ec4899;
  --color-accent-purple-deep: #4f46e5;
  
  /* 其他 */
  --color-hover: rgba(99, 102, 241, 0.08);
  --color-selection: rgba(99, 102, 241, 0.2);
  --color-link: #6366f1;
  --color-link-hover: #4f46e5;
}
```

### 方法2：通过设置面板加载

1. 将你的 CSS 文件托管到某个可访问的位置（GitHub Pages, CDN等）
2. 打开设置面板
3. 在"自定义 CSS"输入框中粘贴 URL
4. 按回车保存

### 方法3：在现有主题基础上修改

你可以基于任意内置主题创建变体：

```css
/* 基于 GitHub Light 改个颜色 */
[data-theme="my-variant"] {
  /* 继承 GitHub Light 的所有变量 */
  /* 只改你需要的 */
  --color-accent-purple: #10b981;
  --color-accent-pink: #059669;
  --color-accent-purple-deep: #047857;
}
```

## 内置主题参考

### default（紫粉渐变）

```css
[data-theme="default"] {
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-border: #f0f0f0;
  --color-text: #2d2d2d;
  --color-text-muted: #999999;
  --color-accent-purple: #d4a5c9;
  --color-accent-pink: #f2c4ce;
  --color-accent-purple-deep: #b88aad;
}
```

### github-light（仿 GitHub 浅色）

```css
[data-theme="github-light"] {
  --color-bg: #ffffff;
  --color-surface: #f6f8fa;
  --color-border: #d0d7de;
  --color-text: #24292f;
  --color-text-muted: #57606a;
  --color-accent-purple: #0969da;
  --color-accent-pink: #0969da;
}
```

### github-dark（仿 GitHub 深色）

```css
[data-theme="github-dark"] {
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-border: #30363d;
  --color-text: #c9d1d9;
  --color-text-muted: #8b949e;
  --color-accent-purple: #58a6ff;
  --color-accent-pink: #58a6ff;
}
```

### notion（仿 Notion）

```css
[data-theme="notion"] {
  --color-bg: #f7f6f3;
  --color-surface: #ffffff;
  --color-border: #e9e9e7;
  --color-text: #37352f;
  --color-text-muted: #9b9a97;
  --color-accent-purple: #2383e2;
  --color-accent-pink: #2383e2;
}
```

### arc（仿 Arc 浏览器）

```css
[data-theme="arc"] {
  --color-bg: #1a1625;
  --color-surface: #251e33;
  --color-border: #3d3456;
  --color-text: #e4e0f3;
  --color-text-muted: #9d97b8;
  --color-accent-purple: #a78bfa;
  --color-accent-pink: #f472b6;
}
```

### dracula（经典 Dracula）

```css
[data-theme="dracula"] {
  --color-bg: #282a36;
  --color-surface: #383a4a;
  --color-border: #44475a;
  --color-text: #f8f8f2;
  --color-text-muted: #6272a4;
  --color-accent-purple: #bd93f9;
  --color-accent-pink: #ff79c6;
}
```

### nord（北极光）

```css
[data-theme="nord"] {
  --color-bg: #2e3440;
  --color-surface: #3b4252;
  --color-border: #434c5e;
  --color-text: #eceff4;
  --color-text-muted: #d8dee9;
  --color-accent-purple: #88c0d0;
  --color-accent-pink: #81a1c1;
}
```

## 完整主题示例

让我们创建一个完整的 "Blue Ocean" 主题：

```css
/* blue-ocean.css */
[data-theme="blue-ocean"] {
  --color-bg: #f0f4f8;
  --color-surface: #ffffff;
  --color-border: #d1d9e0;
  --color-text: #102a43;
  --color-text-muted: #627d98;
  --color-accent-purple: #2e5bff;
  --color-accent-pink: #0099ff;
  --color-accent-purple-deep: #1e40af;
  --color-glow: rgba(46, 91, 255, 0.8);
  --color-hover: rgba(46, 91, 255, 0.08);
  --color-selection: rgba(46, 91, 255, 0.2);
  --color-scrollbar: #9fb3c8;
  --color-scrollbar-hover: #829ab1;
  --color-link: #2e5bff;
  --color-link-hover: #1e40af;
  --color-code-bg: #f8fafc;
  --color-code-border: #e2e8f0;
  --color-success: #27ae60;
  --color-error: #e74c3c;
  --color-warning: #f39c12;
}
```

## 主题设计建议

1. **保持对比**：确保文字和背景有足够对比度
2. **协调色调**：所有颜色来自同一色系
3. **适配浅色/深色**：如果你创建深色主题，确保所有元素都适配
4. **考虑访问性**：确保色盲用户也能正常使用

## 主题测试清单

- [ ] 文字清晰可读
- [ ] 代码块显示正常
- [ ] 按钮和交互元素有明显的视觉反馈
- [ ] 侧边栏和设置面板显示正常
- [ ] 所有内置渲染器（Mermaid、PlantUML等）显示正常

## 贡献主题

如果你创建了一个很棒的主题，欢迎提 PR 贡献到主仓库！
