# 配置参考

所有配置都通过 `iris/config.json` 文件进行管理，无需修改 JavaScript 代码。

## 基础配置

```json
{
  "owner": "your-username",
  "repo": "your-repo-name"
}
```

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `owner` | string | - | GitHub 用户名或组织名 |
| `repo` | string | - | 仓库名 |

## 完整配置项

以下是所有支持的配置项及其默认值：

```json
{
  "owner": "",
  "repo": "",
  "branch": "main",
  "title": "Markdown Preview",
  "defaultTheme": "default",
  "showEditButton": true,
  "showReadingTime": true,
  "showBreadcrumbs": true
}
```

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `branch` | string | `main` | 文档所在的 Git 分支 |
| `title` | string | `Markdown Preview` | 站点标题 |
| `defaultTheme` | string | `default` | 默认主题 ID |
| `showEditButton` | boolean | `true` | 是否显示"编辑此页"按钮 |
| `showReadingTime` | boolean | `true` | 是否显示阅读时间估算 |
| `showBreadcrumbs` | boolean | `true` | 是否显示面包屑导航 |

## 主题

支持的内置主题：

| ID | 名称 |
|----|------|
| `default` | 默认（紫粉渐变） |
| `github-light` | GitHub Light |
| `github-dark` | GitHub Dark |
| `notion` | Notion |
| `arc-dark` | Arc Dark |
| `dracula` | Dracula |
| `nord` | Nord |

在设置面板中可以随时切换主题，选择会保存在本地存储中。

## 配置加载顺序

1. 内置默认配置
2. `iris/config.json` 中的配置（覆盖默认值）
3. 用户本地存储的设置（如主题选择）

部分配置（如主题）可以被用户的本地设置覆盖。
