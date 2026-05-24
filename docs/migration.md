# 迁移指南

从 Docsify 或 MkDocs 迁移到 Markdown Preview 非常简单！

## 从 Docsify 迁移

Docsify 和 Markdown Preview 在架构上有一些差异，但迁移起来非常轻松。

### 主要差异对比

| 特性 | Docsify | Markdown Preview |
|------|---------|------------------|
| 渲染方式 | 动态解析 | 静态 HTML |
| 配置方式 | `index.html` 配置 | 直接使用 |
| 文件树 | `_sidebar.md` | `data/file-tree.json` |
| 插件系统 | Docsify 插件 | 原生插件 |
| 主题系统 | 主题文件 | CSS 变量 |

### 迁移步骤

1. **复制文档**：
   - 将你的所有 `.md` 文档移动到 `docs/` 目录

2. **创建文件树**：
   - 或者手动创建 `data/file-tree.json`
   - Docsify 的 `_sidebar.md` 可以参考这个文件结构，手动转为 JSON

3. **移除 Docsify 特定标记**：
   - 移除 `{docsify-ignore}` 等标记
   - 替换内部链接路径

4. **迁移插件**：
   - Docsify 插件不能直接使用
   - 可以参考 [插件开发指南](plugin-development.md) 重写

5. **部署**：
   - 直接部署到 GitHub Pages 即可

### 常见问题

**Q: 我的侧边栏没显示？**

A: 确保 `data/file-tree.json` 文件正确，并且所有文档路径都在里面。

---

## 从 MkDocs 迁移

### 主要差异对比

| 特性 | MkDocs | Markdown Preview |
|------|--------|------------------|
| 构建方式 | 预构建静态 HTML | 动态渲染 |
| 配置方式 | `mkdocs.yml` | 直接使用 |
| 主题系统 | MkDocs 主题 | CSS 变量 |
| 插件系统 | MkDocs 插件 | 原生插件 |

### 迁移步骤

1. **复制文档**：
   - 将 `docs/` 目录直接复制过来（你很幸运！）
   - MkDocs 通常已经把文档放在 `docs/` 下

2. **文件树**：
   - 你可以直接使用 MkDocs 的结构
   - 创建对应的 `data/file-tree.json`

3. **移除 MkDocs 特定标记**：
   - 移除 `{!include!}` 等指令
   - 替换 `mkdocs-material` 特定语法

4. **主题迁移**：
   - MkDocs Material 等主题无法直接迁移
   - 参考 [主题定制指南](theme-customization.md) 自定义

5. **部署**：
   - MkDocs 通常有构建步骤，Markdown Preview 不需要
   - 直接推送到 GitHub 启用 Pages 即可

### mkdocs.yml 对应关系

| mkdocs.yml 选项 | Markdown Preview 对应 |
|-----------------|-----------------------|
| `site_name` | 暂无 |
| `docs_dir` | 默认是 `docs/` |
| `theme` | [主题系统](theme-customization.md) |
| `markdown_extensions` | 部分内置支持 |

---

## 通用迁移建议

无论你从哪里迁移，以下建议都适用：

1. **不要重写所有内容**：先迁移一部分，看看效果
2. **保持文件结构**：这样更易维护
3. **逐个测试**：迁移一个文档，测试一个文档
4. **记录差异**：把你做的改动记录下来

## 需要帮助？

查看 [故障排查 FAQ](faq.md) 或者提 Issue！
