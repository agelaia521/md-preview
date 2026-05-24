# 配置参考

Markdown Preview 的配置非常简单，主要通过文件结构和浏览器设置来控制。

## 目录结构

Markdown Preview 使用以下目录结构：

```
/ (根目录)
├── index.html            # 主 HTML 文件（不需要修改）
├── data/
│   └── file-tree.json    # 文件树配置
├── docs/                 # 你的文档
│   ├── getting-started.md
│   └── ...
├── plugins/              # 插件
│   └── your-plugin.js
└── css/                  # 样式（不需要修改）
```

## 文件树配置

Markdown Preview 使用 `data/file-tree.json` 来组织侧边栏。这个文件是可选的，你可以手动编辑或者让脚本自动生成。

### 手动编辑 file-tree.json

格式如下：

```json
[
  {
    "name": "docs",
    "type": "folder",
    "children": [
      {
        "name": "getting-started.md",
        "type": "file",
        "path": "docs/getting-started.md"
      }
    ]
  }
]
```

### 自动生成文件树

你可以编写一个简单的脚本来扫描 docs 目录并自动生成 file-tree.json。

## 侧边栏排序

Markdown Preview 按照文件名的字母顺序自动排序。你可以通过以下方式控制顺序：

- 在文件名前加数字前缀，例如 `01-introduction.md`
- 使用拼音排序（中文文件名）

## 设置

Markdown Preview 将用户设置保存在浏览器的 localStorage 中，包括：

| 设置项 | 描述 | 默认值 |
|--------|------|--------|
| showReadingProgress | 显示/隐藏阅读进度条 | true |

## 自定义配置文件（可选）

你可以在根目录创建 `config.json` 来配置项目：

```json
{
  "siteName": "My Documentation",
  "docsDir": "docs",
  "pluginsDir": "plugins",
  "defaultTheme": "default"
}
```

### siteName

你的站点名称，显示在浏览器标签页和一些地方。

### docsDir

文档所在的目录，默认是 `docs`。

### pluginsDir

插件目录，默认是 `plugins`。

### defaultTheme

默认主题，可选值：
- `default`
- `github-light`
- `github-dark`
- `notion`
- `arc`
- `dracula`
- `nord`
