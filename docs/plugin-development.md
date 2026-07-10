# 插件开发指南

## 插件机制概述

Markdown Preview 的插件系统允许你扩展 Markdown 渲染能力，自定义处理特定的代码块。插件放入 `iris/plugins/` 目录后，加载器会自动发现并注册。

## 插件接口

每个插件是一个导出对象的 JavaScript 模块，需要实现以下接口：

```javascript
export default {
  name: 'plugin-name',          // 插件名称（唯一标识）
  description: '插件描述',       // 描述信息
  
  // 判断是否处理该代码块
  test(code, language) {
    return language === 'my-language';
  },
  
  // 渲染内容到容器
  render(code, container) {
    container.innerHTML = '<p>Hello</p>';
  }
};
```

### API 说明

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `test` | `code`: 代码块内容，`language`: 代码语言标识 | `boolean` | 判断该插件是否处理此代码块 |
| `render` | `code`: 代码块内容，`container`: DOM 容器元素 | 无 | 将渲染结果写入容器 |

## 开发插件

### 第一步：创建插件文件

在 `iris/plugins/` 目录下创建新文件，例如 `weather.js`。

### 第二步：实现插件逻辑

以下是一个完整的示例——将 `weather` 代码块渲染为天气卡片：

```javascript
export default {
  name: 'weather',
  description: '天气卡片渲染',
  
  test(code, language) {
    return language === 'weather';
  },
  
  render(code, container) {
    try {
      const data = JSON.parse(code);
      container.innerHTML = `
        <div style="
          display: inline-block;
          padding: 16px 24px;
          border-radius: 12px;
          background: linear-gradient(135deg, #89f7fe, #66a6ff);
          color: #fff;
          font-family: sans-serif;
        ">
          <div style="font-size: 2rem; font-weight: bold;">${data.temp}°C</div>
          <div>${data.city} · ${data.condition}</div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = '<p style="color: red;">天气数据格式错误</p>';
    }
  }
};
```

### 第三步：使用插件

在 Markdown 中使用对应的语言标识：

````markdown
```weather
{
  "temp": 25,
  "city": "北京",
  "condition": "晴"
}
```
````

插件加载器会自动发现 `iris/plugins/` 下的所有 `.js` 文件并注册。

## 渲染时机

插件在 Markdown 渲染管道的最后阶段执行，顺序如下：

1. Marked.js 解析 Markdown → HTML
2. 处理 Frontmatter、Alerts、图片增强等
3. 调用各扩展渲染器（Mermaid、KaTeX 等）
4. **调用插件渲染**（此时执行）

## 参考实现

项目内置的二维码插件 [iris/plugins/qrcode.js](../iris/plugins/qrcode.js) 是一个完整的参考实现，支持：

- 简单文本模式：直接将代码块内容转为二维码
- 配置模式：通过 JSON 配置数据内容和尺寸

````markdown
```qrcode
https://github.com
```
````

## 注意事项

- 插件文件必须放在 `iris/plugins/` 目录下
- 文件名即为插件模块名，使用 `.js` 扩展名
- 插件的 `test` 方法应当精确匹配，避免与其他渲染器冲突
- `render` 方法中应处理异常，避免渲染失败导致页面崩溃
- 插件运行在浏览器端，可以使用浏览器 API（Canvas、Fetch 等）
