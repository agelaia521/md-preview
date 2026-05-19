# API 参考文档

## 配置对象 (CONFIG)

主配置文件，包含所有文档的结构信息。

### 属性

#### `files` (Array)

文件树数组，包含文件夹和文件的定义。

### 文件对象

```javascript
{
  name: '文件名',
  type: 'file',
  path: '相对于根目录的路径'
}
```

### 文件夹对象

```javascript
{
  name: '文件夹名',
  type: 'folder',
  children: [
    // 嵌套的文件或文件夹
  ]
}
```

### 示例配置

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

## 路径规则

- 所有路径相对于仓库根目录
- 使用正斜杠 `/` 分隔路径
- 确保路径与实际文件位置一致

## 注意事项

1. **文件名大小写**：某些文件系统区分大小写
2. **路径分隔符**：始终使用 `/` 而非 `\`
3. **文件扩展名**：确保包含 `.md` 扩展名
