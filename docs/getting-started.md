# 5分钟快速开始

本指南将帮助你在5分钟内快速上手 Markdown Preview。

## 前置要求

你需要：
- 一个 GitHub 账号
- 基本的 Git 知识

## 步骤1: 使用模板创建仓库

1. 访问 [md-preview 仓库](https://github.com/theforeveriris/md-preview)
2. 点击 "Use this template" 按钮创建你的仓库
3. 给仓库起个名字，例如 `my-docs`
4. 选择公开或私有

## 步骤2: 启用 GitHub Pages

1. 进入你的仓库 → Settings → Pages
2. Source 选择 `Deploy from a branch`
3. Branch 选择 `main`，文件夹选择 `/ (root)`
4. 点击 Save

## 步骤3: 添加文档

在你的仓库 `docs` 目录下添加 Markdown 文件。例如，创建 `docs/hello.md`：

```markdown
# 我的第一篇文档

这是我使用 Markdown Preview 发布的第一篇文档！

## 简单列表

- 苹果
- 香蕉
- 橙子
```

## 步骤4: 查看你的文档

1. 等待 GitHub Pages 部署完成（通常需要1-2分钟）
2. 访问 `https://你的用户名.github.io/你的仓库名/`
3. 你应该能看到你的文档了！

## 下一步

- 了解完整的 [Markdown 语法](examples/markdown-syntax.md)
- 查看 [配置参考](configuration.md)
- 学习如何 [开发插件](plugin-development.md)
- 试试创建 [自定义主题](theme-customization.md)

## 接下来去哪里？

如果你是从其他工具迁移过来，查看 [迁移指南](migration.md)。
遇到问题了？查看 [故障排查 FAQ](faq.md)。
