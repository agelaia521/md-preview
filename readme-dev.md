# Markdown Preview - 开发者文档

本文档面向希望深入了解或扩展本项目的开发者。

---

## 0. 部署说明

### 0.1 GitHub Pages 部署（推荐）

项目使用 GitHub Action 自动构建和部署，完全避免 GitHub API 限流问题。

#### 0.1.1 部署流程

1. **Fork 仓库**
2. **配置仓库**
   - 进入 Settings → Pages
   - 源选择 GitHub Actions
3. **自定义配置**
   - 修改 `config.json` 中的 `owner` 和 `repo`（无需懂 JavaScript，编辑更安全！）
4. **推送代码，自动部署**

#### 0.1.2 工作原理

```
代码推送 → GitHub Action 触发
       → 运行 build-file-tree.js 扫描 .md 文件
       → 生成 data/file-tree.json
       → 部署到 GitHub Pages
       → 前端优先从预构建文件读取，无 API 限制
```

#### 0.1.3 本地测试

```bash
node scripts/build-file-tree.js
```

### 0.2 回退机制

如果预构建文件不存在，系统会自动回退到 GitHub API（有限制）。

---

## 1. 项目架构总览

### 1.1 技术栈

| 技术 | 用途 |
|------|------|
| **HTML5** | 页面结构，语义化标签 |
| **CSS3** | 样式系统，响应式设计，CSS 变量 |
| **Vanilla JavaScript** | 核心功能，无框架依赖 |
| **Node.js (仅构建)** | 文件树和搜索索引预构建 |
| **GitHub Actions** | 自动 CI/CD |
| **Marked.js** | Markdown 解析 |
| **Mermaid.js** | 流程图、时序图等图表渲染 |
| **PlantUML** | 多种 UML 和非 UML 图 |
| **ApexCharts** | 交互式图表 |
| **Leaflet.js** | 地理数据可视化 |
| **abcjs** | ABC 音乐记谱法渲染 |
| **Verovio** | MusicXML 乐谱渲染 |
| **OSMD** | OpenSheetMusicDisplay 乐谱渲染 |
| **diff2html** | Git Diff 可视化 |
| **KaTeX** | LaTeX 数学公式渲染 |
| **Giscus** | 基于 GitHub Discussions 的评论系统 |

### 1.2 新增功能模块

| 模块 | 用途 |
|------|------|
| **主题系统** | CSS 变量主题，7 种内置主题，自定义主题支持 |
| **设置面板** | 集中式设置管理，主题切换，自定义 CSS 配置 |
| **插件系统** | 扩展渲染器支持（如二维码生成） |

### 1.3 核心文件结构

```
md-preview/
├── index.html          # 主页面结构，库依赖声明，Open Graph meta 标签
├── app.js             # 入口文件，初始化应用
├── config.json         # 外部配置文件（用户配置，无需懂 JavaScript
├── styles.css         # 完整样式系统（已弃用，使用 css/ 目录下的模块化 CSS
├── css/              # 模块化样式目录
│   ├── base.css     # 基础样式
│   ├── components.css # 组件样式
│   ├── floating.css # 悬浮球和浮动元素样式
│   ├── layout.css  # 布局样式
│   ├── markdown.css # Markdown 渲染样式
│   ├── themes.css   # 主题系统（7 种内置主题）
│   └── responsive.css # 响应式样式
├── README.md          # 用户文档
├── readme-dev.md     # 本文档（开发者文档）
├── js/              # 核心模块目录
│   ├── config.js     # 配置文件
│   ├── state.js     # 状态管理
│   ├── dom.js       # DOM 元素引用
│   ├── ui.js        # UI 工具函数
│   ├── file-tree.js # 文件树加载和渲染
│   ├── markdown.js  # Markdown 渲染和处理（含图片处理、阅读时间、Alerts）
│   ├── search.js    # 全文搜索功能
│   ├── router.js    # Hash 路由管理
│   ├── settings.js  # 用户设置管理（设置面板）
│   ├── themes/      # 主题管理器
│   │   └── theme-manager.js  # 主题切换、自定义 CSS、本地存储
│   └── renderers/  # 扩展功能渲染器
│       ├── mermaid.js
│       ├── plantuml.js
│       ├── apexcharts.js
│       ├── music-notation.js
│       ├── diff.js
│       ├── geo.js
│       ├── embedded.js
│       └── katex.js
├── plugins/         # 插件目录
│   └── qrcode.js    # 二维码生成插件
├── scripts/
│   ├── build-file-tree.js   # 文件树预构建脚本
│   └── build-search-index.js  # 搜索索引预构建脚本
├── data/
│   └── file-tree.json      # 预构建的文件树（由 Action 生成）
├── search-index.json       # 预构建的搜索索引（由 Action 生成）
└── .github/
    └── workflows/
        ├── build-and-deploy.yml       # GitHub Action 配置
        └── build-search-index.yml    # 搜索索引自动构建
```

### 1.4 架构特点

- **纯前端架构**：无需后端，所有逻辑在浏览器运行
- **预构建优化**：文件树预部署，避免 GitHub API 限流
- **模块化设计**：使用 IIFE 模式避免全局污染
- **事件驱动**：通过事件委托处理用户交互
- **异步渲染**：Markdown 解析和内容渲染分离
- **主题系统**：CSS 变量驱动，易于扩展
- **插件架构**：可扩展渲染器支持

---

## 2. 模块化架构分析

### 2.1 模块结构

项目采用 IIFE（立即调用函数表达式）模式，将功能拆分为独立模块，通过 `window.MarkdownPreview` 全局对象进行通信。

```
模块依赖关系：
┌─────────────────────────────────────────────────────────┐
│                     app.js (入口)                       │
│  初始化：fileTree.loadFileTree() + ui.setupEventListeners() + search.init() + themes.init()
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  file-tree.js    │    │    ui.js         │
│  - 文件树加载    │    │  - UI 工具       │
│  - 目录渲染      │    │  - 事件监听      │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         └──────────┬────────────┘
                    ▼
         ┌──────────────────┐
         │   markdown.js    │
         │  - Markdown 渲染 │
         │  - Frontmatter   │
         │  - 面包屑导航    │
         │  - 编辑按钮      │
         │  - 插件渲染      │
         └────────┬─────────┘
                  │
         ┌────────┴────────┐
         ▼                 ▼
   ┌──────────┐    ┌──────────────┐
   │ renderers│    │  dom.js      │
   │  目录    │    │  DOM 引用    │
   └────┬─────┘    └──────┬───────┘
        │                 │
   ┌────┴─────┐    ┌──────┴───────┐
   │          │    │              │
   ▼          ▼    ▼              ▼
mermaid   plantuml  state.js    config.js
(其他渲染器...)
                      │
                      │    ┌──────────────┐
                      │    │  search.js    │
                      │    │  - 搜索功能   │
                      │    └──────┬───────┘
                      │           │
                      │    ┌──────┴───────┐
                      │    │  router.js   │
                      │    │  - 路由管理  │
                      │    └──────────────┘
                      │
                      │    ┌──────────────┐
                      │    │  themes.js   │
                      │    │  - 主题切换  │
                      │    └──────────────┘
                      │
                      │    ┌──────────────┐
                      │    │ settings.js  │
                      │    │  - 设置面板  │
                      │    └──────────────┘
```

### 2.2 核心模块详解

#### 2.2.1 配置模块 (`js/config.js`)

**功能**：集中管理项目配置，支持从外部 `config.json` 文件加载

**核心实现**：

```javascript
// 默认配置作为后备
const DEFAULT_CONFIG = {
  owner: 'theforeveriris',
  repo: 'md-preview',
  giscus: { /* ... */ }
};

// 异步加载外部配置
async function loadConfig() {
  try {
    const response = await fetch('config.json');
    if (response.ok) {
      const externalConfig = await response.json();
      // 深度合并默认配置和外部配置
      window.MarkdownPreview.CONFIG = mergeDeep(DEFAULT_CONFIG, externalConfig);
    }
  } catch (error) {
    // 加载失败时使用默认配置
  }
}
```

**特点**：
- 外部化配置：用户通过编辑 `config.json` 修改，无需懂 JavaScript
- 安全回退：如果 `config.json` 不存在或加载失败，自动使用内置默认配置
- 深度合并：支持部分配置覆盖，无需复制整个配置对象
- 同步加载：应用启动时等待配置加载完成

**外部配置文件结构 (`config.json`)**：
```json
{
  "owner": "your-username",
  "repo": "your-repo",
  "giscus": {
    "enabled": true,
    "repo": "your-username/your-repo",
    "repoId": "your-repo-id",
    "category": "Announcements",
    "categoryId": "your-category-id"
  }
}
```

#### 2.2.2 状态管理模块 (`js/state.js`)

**功能**：全局状态集中管理
```javascript
window.MarkdownPreview.state = {
  fileTreeData: [],       // 文件树数据
  currentMode: 'files',    // 当前模式
  currentFilePath: '',     // 当前文件
  currentHeadings: [],   // 标题列表
  currentTheme: 'default' // 当前主题
};
```

#### 2.2.3 DOM 引用模块 (`js/dom.js`)

**功能**：统一管理 DOM 元素引用，避免重复查询

```javascript
window.MarkdownPreview.dom = {
  fileTree: document.getElementById('fileTree'),
  markdownContent: document.getElementById('markdownContent'),
  themeSelect: document.getElementById('themeSelect'),
  customCSSInput: document.getElementById('customCSSInput'),
  // ...其他元素
};
```

#### 2.2.4 文件树模块 (`js/file-tree.js`)

**功能**：双重策略加载文件树
1. **优先使用预构建文件** - 无 API 限制，性能最佳
2. **回退到 GitHub API** - 作为备用方案

```javascript
async function loadFileTree() {
  try {
    // 首先尝试加载预构建的文件树
    const prebuiltUrl = './data/file-tree.json';
    let response = await fetch(prebuiltUrl);
    
    if (response.ok) {
      console.log('✅ 使用预构建的文件树');
      fileTreeData = await response.json();
      renderFileTree(fileTreeData);
      return;
    } else {
      console.log('⚠️ 预构建文件不存在，使用 GitHub API');
      await loadFileTreeFromGitHubAPI();
    }
  } catch (error) {
    console.error('⚠️ 加载预构建文件树失败，使用 GitHub API:', error);
    await loadFileTreeFromGitHubAPI();
  }
}

async function loadFileTreeFromGitHubAPI() {
  // GitHub API 回退方案
  const apiUrl = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/git/trees/main?recursive=1`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  fileTreeData = buildTreeFromFlatList(data.tree);
  renderFileTree(fileTreeData);
}
```

**特点**：
- 预构建优先，完全避免 API 限流
- 自动回退，保持兼容性
- 使用 `recursive=1` 获取完整树结构
- 自动过滤 `.md` 文件

#### 2.2.5 主题管理模块 (`js/themes/theme-manager.js`)

**功能**：主题切换、自定义 CSS、本地存储持久化

```javascript
// 内置主题列表
const builtInThemes = [
  { id: 'default', name: '紫粉渐变' },
  { id: 'github-light', name: 'GitHub Light' },
  { id: 'github-dark', name: 'GitHub Dark' },
  { id: 'notion', name: 'Notion' },
  { id: 'arc', name: 'Arc Dark' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'nord', name: 'Nord' }
];

function setTheme(themeId, save = true) {
  document.documentElement.setAttribute('data-theme', themeId);
  if (save) {
    localStorage.setItem('md-preview-theme', themeId);
  }
  // 触发主题切换事件
  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme: themeId }
  }));
}

function setCustomCSS(url) {
  localStorage.setItem('md-preview-custom-css', url);
  // 移除旧的 link 元素，添加新的
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}
```

**特点**：
- CSS 变量驱动，易于扩展
- localStorage 持久化
- 支持自定义 CSS 外部链接
- 事件机制，插件可监听主题变化

#### 2.2.6 设置面板模块 (`js/settings.js`)

**功能**：集中式设置管理，设置面板 UI 交互

```javascript
function initSettingsPanel() {
  // 初始化主题下拉菜单
  const themeSelect = dom.themeSelect;
  // 加载自定义 CSS 输入框
  const customCSSInput = dom.customCSSInput;
  // 显示/隐藏控制
  // 事件绑定
}
```

#### 2.2.7 Markdown 渲染模块 (`js/markdown.js`)

**功能**：Markdown 文件加载、渲染和链接拦截

**渲染管道**（至关重要）：
```javascript
setTimeout(() => {
  window.MarkdownPreview.renderers.apexcharts.render();
  window.MarkdownPreview.renderers.musicNotation.render();
  window.MarkdownPreview.renderers.diff.render();
  window.MarkdownPreview.renderers.mermaid.render();
  window.MarkdownPreview.renderers.plantuml.render();
  window.MarkdownPreview.renderers.geo.render();
  window.MarkdownPreview.renderers.embedded.render();
  window.MarkdownPreview.renderers.katex.render();
  // 插件渲染（如二维码）
  renderWithPlugins();
}, 100);
```

#### 2.2.8 插件系统 (`plugins/`)

**插件接口**：
```javascript
export default {
  name: 'plugin-name',
  description: '插件描述',
  test(code, language) {
    // 判断是否应该处理该代码块
    return language === 'my-language';
  },
  render(code, container) {
    // 渲染内容到容器
    container.innerHTML = '...';
  }
};
```

**示例：二维码插件 (`plugins/qrcode.js`)**：
```javascript
export default {
  name: 'qrcode',
  description: '二维码生成',
  
  test(code, language) {
    return language === 'qrcode';
  },
  
  render(code, container) {
    // 解析配置
    // 调用外部 API 或本地 Canvas 渲染
    // 替换代码块
  }
};
```

#### 2.2.9 渲染器模块 (`js/renderers/`)

每个渲染器都是独立模块，提供统一的 `render()` 接口：
- `mermaid.js` - Mermaid 图表
- `plantuml.js` - PlantUML 图表
- `apexcharts.js` - ApexCharts 图表
- `music-notation.js` - 乐谱渲染
- `diff.js` - Diff 可视化
- `geo.js` - 地理数据可视化
- `embedded.js` - 外部服务嵌入
- `katex.js` - LaTeX 公式渲染

---

## 3. 样式系统分析

### 3.1 CSS 模块化架构

项目已从单一的 `styles.css` 拆分为多个模块化 CSS 文件，便于维护：

| 文件 | 用途 |
|------|------|
| `base.css` | 基础样式（重置、全局样式） |
| `components.css` | 组件样式（按钮、卡片等） |
| `floating.css` | 悬浮元素样式（FAB、弹出层等） |
| `layout.css` | 布局样式（侧边栏、主内容区等） |
| `markdown.css` | Markdown 渲染样式（包括 Alerts、图片画廊等） |
| `themes.css` | 主题系统（7 种内置主题） |
| `responsive.css` | 响应式样式（媒体查询） |

### 3.2 设计系统

#### 3.2.1 CSS 变量（Design Tokens）

```css
:root {
  /* 颜色 */
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-border: #f0f0f0;
  --color-text: #2d2d2d;
  --color-text-muted: #999999;
  --color-accent-purple: #d4a5c9;
  --color-accent-pink: #f2c4ce;
  --color-accent-purple-deep: #b88aad;
  
  /* 字体 */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'IBM Plex Sans', -apple-system, sans-serif;
  
  /* 尺寸 */
  --sidebar-width: 280px;
  
  /* 动画 */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 3.2.2 色彩系统

**主色调**：浅紫 + 浅粉
- 柔和不刺眼
- 适合长时间阅读
- 高对比度，易于识别

**配色规则**：
- 背景：`#fafafa`（接近白色，减少眼睛疲劳）
- 卡片：`#ffffff`（纯白，突出内容）
- 边框：`#f0f0f0`（极淡，区分层级）

#### 3.2.3 字体系统

| 用途 | 字体 | 特点 |
|------|------|------|
| 标题 | Cormorant Garamond | 衬线体，优雅，适合标题 |
| 正文 | IBM Plex Sans | 无衬线，清晰，适合阅读 |

---

## 4. 扩展开发指南

### 4.1 添加新的主题

**步骤 1**：在 `css/themes.css` 中添加主题变量

```css
[data-theme="my-theme"] {
  --color-bg: #...;
  --color-surface: #...;
  /* 其他变量 */
}
```

**步骤 2**：在 `js/themes/theme-manager.js` 中添加主题到列表

**步骤 3**：在设置面板下拉菜单中添加选项（可选）

### 4.2 添加新的渲染器插件

**步骤 1**：在 `plugins/` 目录创建插件文件

```javascript
// plugins/my-plugin.js
export default {
  name: 'my-plugin',
  test(code, language) {
    return language === 'my-language';
  },
  render(code, container) {
    container.innerHTML = '...';
  }
};
```

**步骤 2**：在 `js/markdown.js` 的 `renderWithPlugins()` 中加载（可选）

### 4.3 添加新的图表渲染器

**步骤 1**：在 `index.html` 添加库依赖

```html
<script src="https://cdn.example.com/chart-lib.min.js"></script>
```

**步骤 2**：实现渲染函数（放在 `js/renderers/` 或 `plugins/`）

**步骤 3**：在渲染管道中注册

---

## 5. 版本历史与贡献

### 5.1 当前版本功能

| 功能 | 状态 | 代码位置 |
|------|------|---------|
| GitHub API 集成 | ✅ 完成 | js/file-tree.js |
| 文件树构建 | ✅ 完成 | js/file-tree.js |
| Markdown 渲染 | ✅ 完成 | js/markdown.js |
| Mermaid 图表 | ✅ 完成 | js/renderers/mermaid.js |
| PlantUML 图表 | ✅ 完成 | js/renderers/plantuml.js |
| ApexCharts | ✅ 完成 | js/renderers/apexcharts.js |
| 乐谱渲染 | ✅ 完成 | js/renderers/music-notation.js |
| Diff 可视化 | ✅ 完成 | js/renderers/diff.js |
| 地理数据可视化 | ✅ 完成 | js/renderers/geo.js |
| Twitter/X 嵌入 | ✅ 完成 | js/renderers/embedded.js |
| 外部服务嵌入 | ✅ 完成 | js/renderers/embedded.js |
| **全文搜索** | ✅ 完成 | js/search.js |
| **Hash 路由** | ✅ 完成 | js/router.js |
| **面包屑导航** | ✅ 完成 | js/markdown.js |
| **编辑按钮** | ✅ 完成 | js/markdown.js |
| **Frontmatter** | ✅ 完成 | js/markdown.js |
| **悬浮 FAB** | ✅ 完成 | css/floating.css + index.html |
| **Giscus 评论** | ✅ 完成 | js/markdown.js + config.js |
| **阅读时间估算** | ✅ 完成 | js/markdown.js |
| **GitHub 风格 Alerts** | ✅ 完成 | js/markdown.js + css/markdown.css |
| **图片懒加载** | ✅ 完成 | js/markdown.js |
| **图片画廊模式** | ✅ 完成 | js/markdown.js + css/markdown.css |
| **图片错误降级** | ✅ 完成 | js/markdown.js + css/markdown.css |
| **Open Graph / Twitter Card** | ✅ 完成 | index.html |
| **评论区跨文档隔离** | ✅ 完成 | js/markdown.js |
| **CSS 模块化** | ✅ 完成 | css/ 目录 |
| **外部化配置** | ✅ 完成 | config.json + js/config.js + app.js |
| **调试模式** | ✅ 完成 | js/debug.js + css/markdown.css + index.html |
| **LaTeX 公式** | ✅ 完成 | js/renderers/katex.js |
| **主题系统** | ✅ 完成 | js/themes/theme-manager.js + css/themes.css |
| **设置面板** | ✅ 完成 | js/settings.js + index.html |
| **二维码插件** | ✅ 完成 | plugins/qrcode.js |

---

**最后更新**：2026-05-24
**文档版本**：1.4.0
