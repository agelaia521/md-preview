# Markdown Preview

一个极简风格的 Markdown 文档预览站点，专为 GitHub Pages 设计，完全静态，无需后端。

## ✨ 特性

- 📂 **自动发现** — 自动扫描仓库中所有 `.md` 文件，构建文档目录树
- 🔍 **全文搜索** — 基于 FlexSearch 的快速全文检索
- 📱 **响应式设计** — 完美适配桌面端和移动端
- 🎨 **7 种内置主题** — 默认 / GitHub Light / GitHub Dark / Notion / Arc Dark / Dracula / Nord
- 🖼️ **图片增强** — 懒加载、画廊模式、错误降级
- 📢 **GitHub 风格 Alerts** — 支持 `[!NOTE]` `[!WARNING]` 等提示语法
- ⏱️ **阅读时间估算** — 自动计算预计阅读时长
- 🔌 **插件系统** — 支持扩展自定义渲染器
- 📲 **PWA 支持** — 可安装到桌面，离线访问
- 🔗 **Hash 路由** — 每个文档有独立 URL，支持分享和书签
- 📝 **Frontmatter** — 支持 YAML 元数据解析
- ✏️ **编辑此页** — 悬浮球快速跳转 GitHub 编辑页面

## 🚀 快速开始

### GitHub Pages 部署

1. Fork 本仓库
2. 进入仓库 **Settings → Pages**
3. Source 选择 **GitHub Actions**
4. 修改 `iris/config.json` 中的 `owner` 和 `repo` 为你的信息
5. 推送代码，等待 GitHub Actions 自动构建部署

### 本地预览

```bash
# 克隆仓库
git clone <your-repo-url>
cd <repo-name>

# 构建文件树（可选，不构建则使用 GitHub API 回退）
node iris/scripts/build-file-tree.js

# 用浏览器打开 index.html
```

## ⚙️ 配置

修改 `iris/config.json` 自定义配置：

```json
{
  "owner": "your-username",
  "repo": "your-repo-name"
}
```

## 📁 文档放置

在仓库任意位置创建 `.md` 文件即可，系统会自动发现并显示在侧边栏。推荐放在 `docs/` 目录下。

```
你的仓库/
├── README.md
├── docs/
│   ├── guide.md
│   ├── api/
│   │   └── reference.md
│   └── examples/
│       └── table-examples.md
└── ...
```

## 🎯 支持的渲染功能

| 功能 | 说明 |
|------|------|
| **Markdown 基础** | 标题、列表、表格、引用、代码块等 |
| **Mermaid 图表** | 流程图、时序图、甘特图等 18+ 种 |
| **PlantUML** | UML 图、架构图、思维导图等 |
| **ApexCharts** | 交互式折线图、柱状图、饼图等 |
| **LaTeX 公式** | 基于 KaTeX 的数学公式渲染 |
| **二维码** | 使用 `qrcode` 代码块生成二维码 |
| **Diff 可视化** | Git Diff 语法高亮对比 |
| **GeoJSON** | 基于 Leaflet 的地理数据地图 |
| **外部嵌入** | YouTube、Bilibili、Figma、CodePen 等 |
| **GitHub Alerts** | `[!NOTE]` `[!TIP]` `[!WARNING]` 等 |

更多示例请查看 [docs/examples/](docs/examples/)。

## 📂 项目结构

```
.
├── index.html              # 入口页面
├── manifest.json           # PWA 清单
├── sw.js                   # Service Worker
├── iris/
│   ├── app.js              # 应用入口
│   ├── config.json         # 用户配置
│   ├── styles.css          # 样式入口
│   ├── css/                # 模块化样式
│   ├── js/                 # 核心功能模块
│   ├── vendor/             # 第三方依赖（本地化）
│   ├── plugins/            # 插件目录
│   ├── icons/              # 图标资源
│   ├── data/               # 预构建数据
│   └── scripts/            # 构建脚本
├── docs/                   # 文档目录
│   └── examples/           # 功能示例
└── .github/workflows/      # GitHub Actions
```

## 📄 License

MIT
