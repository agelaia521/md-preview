# 故障排查 FAQ

这里是常见问题和解决方案！

---

## 基础问题

### Q: 文档打不开？页面404？

**A:** 检查以下几点：
1. 你的 GitHub Pages 部署是否成功了？
2. 仓库名是否正确？
3. 文件名是否和 file-tree.json 中的一致？
4. 大小写是否匹配？（GitHub Pages 区分大小写）

### Q: 侧边栏没显示？

**A:**
1. 检查 `data/file-tree.json` 文件是否存在
2. 检查 JSON 格式是否正确（没有语法错误）
3. 检查路径是否正确，特别是 `path` 字段

### Q: Markdown 渲染不对？

**A:**
Markdown Preview 使用 Marked.js，标准的 CommonMark 语法。检查你的语法：
- 列表是否正确缩进？
- 代码块是否用反引号正确包围？
- 链接格式是否正确？

---

## 渲染器问题

### Q: Mermaid 图表没显示？

**A:**
1. 检查网络连接（Mermaid 从 CDN 加载）
2. 检查浏览器控制台是否有错误
3. 确保你的 Mermaid 语法正确

### Q: PlantUML 不工作？

**A:**
PlantUML 通过 `www.plantuml.com` 渲染：
1. 检查网络连接
2. 尝试访问 `https://www.plantuml.com/plantuml/`
3. 检查 PlantUML 语法是否正确

### Q: KaTeX 公式没渲染？

**A:**
1. 检查语法：`$inline$` 或 `$$block$$`
2. 查看浏览器控制台
3. 检查 KaTeX CDN 是否能访问

---

## 主题问题

### Q: 主题切换没生效？

**A:**
1. 打开浏览器控制台查看是否有错误
2. 检查你是否正确保存了设置
3. 尝试清除浏览器缓存刷新页面

### Q: 自定义 CSS 没加载？

**A:**
1. 检查 URL 是否能访问（直接在浏览器访问看看）
2. 确保是 HTTPS 协议（GitHub Pages 需要）
3. 检查浏览器 Network 面板

### Q: 某些颜色显示不对？

**A:**
可能是你的自定义主题 CSS 语法有问题：
1. 检查 CSS 变量名是否正确拼写
2. 检查颜色值格式（#xxx, rgb() 等）
3. 使用浏览器开发者工具检查元素

---

## 插件问题

### Q: 我的插件没加载？

**A:**
1. 插件文件是否在 `plugins/` 目录下？
2. 是否使用了正确的 ES 模块语法（`export default`）？
3. 浏览器控制台有什么错误？
4. 检查插件文件是否正确推送到 GitHub

### Q: 插件功能不正常？

**A:**
常见原因：
1. 你的 `test()` 函数没有正确返回 `true`
2. `render()` 函数有运行时错误
3. 外部依赖没正确加载（比如 CDN 无法访问）
4. 使用 [插件开发指南](plugin-development.md) 中的调试技巧

---

## 部署问题

### Q: GitHub Pages 部署超时？

**A:**
这是 GitHub Pages 常见问题：
1. 等 10-15 分钟再试
2. 检查是否有大型文件
3. 确保仓库是公开的或使用正确的权限

### Q: 本地可以用，GitHub Pages 不行？

**A:**
常见原因：
1. 路径问题（本地和 GitHub Pages 的 base URL 不同）
2. CORS 问题（某些 CDN 可能有问题）
3. 文件大小写问题（macOS 不区分，Linux 区分）

### Q: 刷新页面 404？

**A:**
这是正常的！Markdown Preview 使用 Hash 路由，所以：
- 正常访问：`https://user.github.io/repo/#/docs/file.md`
- 不要直接访问：`https://user.github.io/repo/docs/file.md`

---

## 其他问题

### Q: 可以本地预览吗？

**A:** 可以！
1. 用 VS Code 的 "Live Server" 插件
2. 或用 Python 启动简易服务器：
   ```bash
   python3 -m http.server 8000
   ```
3. 然后在浏览器打开 `http://localhost:8000`

### Q: 如何从 GitHub 仓库获取更新？

**A:**
如果你是从模板创建的，可以：
1. 添加上游仓库：
   ```bash
   git remote add upstream https://github.com/theforeveriris/md-preview.git
   ```
2. 获取更新：
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

### Q: 可以离线使用吗？

**A:**
基本功能可以，但很多渲染器依赖 CDN（Mermaid, KaTeX 等），需要网络。

---

## 仍然没解决？

1. 查看浏览器控制台（按 F12，看 Console 标签）
2. 查看 Network 面板（有没有请求失败）
3. 检查你的文件是否正确推送到 GitHub
4. 提 Issue！把问题描述清楚，最好附截图和错误信息
