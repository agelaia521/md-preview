# 主题定制

## 内置主题

| ID | 名称 | 说明 |
|----|------|------|
| `default` | 默认 | 浅紫浅粉渐变风格 |
| `github-light` | GitHub Light | GitHub 明亮风格 |
| `github-dark` | GitHub Dark | GitHub 深色风格 |
| `notion` | Notion | Notion 暖灰风格 |
| `arc-dark` | Arc Dark | Arc 浏览器彩虹紫风格 |
| `dracula` | Dracula | Dracula 经典配色 |
| `nord` | Nord | 北极光配色 |

在悬浮球菜单中点击设置图标，即可切换主题。

## 使用自定义主题

你可以通过加载外部 CSS 文件的方式使用自定义主题。

### 方法：设置面板加载

1. 点击悬浮球中的设置按钮
2. 在"自定义 CSS"输入框中填入你的 CSS 文件 URL
3. 点击"应用"

### 自定义主题 CSS 结构

自定义主题需要定义以下 CSS 变量：

```css
[data-theme="custom"] {
  /* 背景与表面 */
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-surface-hover: #f8f8f8;
  
  /* 边框与分隔 */
  --color-border: #f0f0f0;
  --color-border-light: #f5f5f5;
  
  /* 文字颜色 */
  --color-text: #2d2d2d;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  
  /* 主题色 */
  --color-accent-purple: #d4a5c9;
  --color-accent-pink: #f2c4ce;
  --color-accent-purple-deep: #b88aad;
  --color-accent-gradient: linear-gradient(135deg, #d4a5c9, #f2c4ce);
  
  /* 代码块 */
  --color-code-bg: #f6f6f6;
  --color-code-text: #d6336c;
  
  /* 其他 */
  --color-shadow: rgba(0, 0, 0, 0.04);
  --color-overlay: rgba(255, 255, 255, 0.85);
}
```

> **提示**：你可以复制 `iris/css/themes/themes.css` 中任意一个主题的变量定义作为起点，修改颜色值即可。
