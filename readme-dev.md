# Markdown Preview - 开发者文档

面向希望深入了解或扩展本项目的开发者。

---

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 + CSS 变量 | 样式系统、响应式、主题 |
| Vanilla JavaScript | 核心逻辑，无框架依赖 |
| Node.js（仅构建） | 文件树与搜索索引预构建 |
| GitHub Actions | CI/CD 自动部署 |
| Marked.js | Markdown 解析 |
| FlexSearch | 全文搜索 |
| Mermaid.js | 图表渲染 |
| PlantUML | UML 图表 |
| ApexCharts | 交互式图表 |
| KaTeX | LaTeX 公式 |
| Leaflet.js | 地理数据地图 |
| diff2html | Git Diff 可视化 |

## 项目架构

### 目录结构

```
.
├── index.html              # 入口页面，声明库依赖
├── manifest.json           # PWA 应用清单
├── sw.js                   # Service Worker（离线缓存）
├── iris/
│   ├── app.js              # 应用入口，初始化各模块
│   ├── config.json         # 用户配置文件
│   ├── styles.css          # 样式入口（汇总各 CSS 模块）
│   ├── css/
│   │   ├── base.css        # 基础样式与重置
│   │   ├── layout.css      # 布局（侧边栏、主内容区）
│   │   ├── components.css  # 组件样式
│   │   ├── markdown.css    # Markdown 渲染样式
│   │   ├── floating.css    # 悬浮球与浮动元素
│   │   ├── responsive.css  # 响应式适配
│   │   └── themes/
│   │       └── themes.css  # 7 种内置主题
│   ├── js/
│   │   ├── config.js       # 配置加载模块
│   │   ├── state.js        # 全局状态管理
│   │   ├── dom.js          # DOM 元素引用
│   │   ├── ui.js           # UI 工具与事件监听
│   │   ├── file-tree.js    # 文件树加载与渲染
│   │   ├── markdown.js     # Markdown 渲染与处理
│   │   ├── search.js       # 全文搜索
│   │   ├── router.js       # Hash 路由
│   │   ├── settings.js     # 设置面板
│   │   ├── debug.js        # 调试模式
│   │   ├── themes/
│   │   │   └── theme-manager.js  # 主题管理器
│   │   ├── plugins/
│   │   │   └── loader.js   # 插件加载器
│   │   └── renderers/      # 扩展渲染器
│   │       ├── mermaid.js
│   │       ├── plantuml.js
│   │       ├── apexcharts.js
│   │       ├── katex.js
│   │       ├── diff.js
│   │       ├── geo.js
│   │       └── embedded.js
│   ├── vendor/             # 第三方依赖（本地化，无 CDN）
│   │   ├── marked.js
│   │   ├── flexsearch.bundle.js
│   │   ├── mermaid.min.js
│   │   ├── apexcharts.min.js
│   │   ├── pako.min.js
│   │   ├── katex/
│   │   ├── leaflet/
│   │   └── diff2html/
│   ├── plugins/            # 自定义插件
│   │   └── qrcode.js
│   ├── icons/              # PWA 图标资源
│   ├── data/               # 预构建数据
│   │   ├── file-tree.json
│   │   └── search-index.json
│   └── scripts/            # 构建脚本
│       ├── build-file-tree.js
│       └── build-search-index.js
├── docs/
│   └── examples/           # 功能示例文档
└── .github/workflows/
    ├── build-and-deploy.yml     # 主部署流程
    ├── build-search-index.yml   # 搜索索引构建
    └── sync-to-product.yml      # product 分支同步
```

### 模块依赖关系

```
app.js (入口)
  ├── file-tree.js     # 文件树加载
  ├── ui.js            # UI 事件
  ├── search.js        # 全文搜索
  ├── router.js        # Hash 路由
  ├── debug.js         # 调试面板
  ├── markdown.js      # Markdown 渲染
  │     ├── renderers/ # 各扩展渲染器
  │     └── plugins/   # 自定义插件
  ├── themes/          # 主题管理
  └── settings.js      # 设置面板
```

### 核心模块说明

#### `config.js` — 配置加载

从 `iris/config.json` 加载用户配置，与默认配置深度合并。加载失败时使用默认配置兜底。

#### `file-tree.js` — 文件树

双重加载策略：
1. 优先加载预构建的 `iris/data/file-tree.json`（无 API 限制，速度快）
2. 不存在则回退到 GitHub API（`recursive=1` 获取完整树）

自动过滤 `.md` 文件，构建嵌套目录结构。

#### `markdown.js` — Markdown 渲染

渲染管道：
1. Marked.js 解析 Markdown
2. 处理 Frontmatter（YAML 元数据）
3. 处理 GitHub Alerts
4. 图片增强（懒加载、画廊、错误降级）
5. 面包屑导航生成
6. 调用各扩展渲染器（Mermaid、KaTeX 等）
7. 调用插件渲染

#### `search.js` — 全文搜索

基于 FlexSearch，支持：
- 预构建索引（`iris/data/search-index.json`）
- 标题和内容搜索
- 实时搜索结果高亮

#### `theme-manager.js` — 主题系统

基于 CSS 变量，7 种内置主题：
- default（紫粉渐变）
- github-light / github-dark
- notion
- arc-dark
- dracula
- nord

支持自定义 CSS 主题（输入外部 URL），通过 localStorage 持久化。

### 插件系统

插件接口：

```javascript
export default {
  name: 'plugin-name',
  description: '插件描述',
  
  test(code, language) {
    return language === 'my-language';
  },
  
  render(code, container) {
    container.innerHTML = '...';
  }
};
```

将插件文件放入 `iris/plugins/` 目录，插件加载器会自动发现并注册。

## 部署与构建

### GitHub Pages 部署

工作流：`build-and-deploy.yml`

1. 推送代码到 `main` 分支触发
2. 运行 `iris/scripts/build-file-tree.js` 预构建文件树
3. 上传整个仓库为 Pages Artifact
4. 部署到 GitHub Pages

### 搜索索引构建

工作流：`build-search-index.yml`

- 当 `docs/**` 路径下文件变更时触发
- 运行 `iris/scripts/build-search-index.js` 生成搜索索引
- 提交并推送到仓库

### Product 分支同步

工作流：`sync-to-product.yml`

- 推送 `main` 时触发
- 创建 `product` 分支，移除所有 `.md` 文件
- 用于纯应用发布（不含文档）

## PWA

配置文件：
- `manifest.json` — 应用清单（名称、图标、启动 URL）
- `sw.js` — Service Worker（离线缓存）

特性：
- 可安装到桌面/手机主屏幕
- 离线访问已缓存资源
- 安装按钮集成在悬浮球菜单中

## 本地开发

```bash
# 构建文件树
node iris/scripts/build-file-tree.js

# 构建搜索索引
node iris/scripts/build-search-index.js

# 用浏览器直接打开 index.html 即可预览
```

## 样式开发

CSS 采用模块化架构，按功能拆分到 `iris/css/` 目录下的各文件中，最终通过 `iris/styles.css` 汇总。

主题通过 CSS 变量实现，新增主题只需在 `iris/css/themes/themes.css` 中添加新的 `[data-theme="xxx"]` 选择器并定义变量。

## 调试模式

访问 URL 时添加 `?debug=1` 参数，右上角会显示调试面板，包含：
- 加载耗时
- 文件数量
- 搜索索引状态
- 内存使用

---

**文档版本**: 2.0
