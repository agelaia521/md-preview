# 高级配置

学习如何自定义和扩展你的 Markdown 预览器。

## 配置文件结构

在 `app.js` 中编辑 `CONFIG.files`：

```javascript
const CONFIG = {
  files: [
    {
      name: 'README.md',
      type: 'file',
      path: 'README.md'
    },
    {
      name: 'docs',
      type: 'folder',
      children: [
        {
          name: 'guide.md',
          type: 'file',
          path: 'docs/guide.md'
        }
      ]
    }
  ]
};
```

## 添加新文件

1. 在 `CONFIG.files` 中添加新条目
2. 设置 `type: 'file'`
3. 指定正确的 `path`

## 创建新文件夹

```javascript
{
  name: '新文件夹',
  type: 'folder',
  children: [
    // 在这里添加文件
  ]
}
```

## 最佳实践

- 保持结构清晰
- 使用有意义的文件名
- 定期更新文件列表
