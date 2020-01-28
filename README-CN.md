# vue-cli-plugin-eruda

[![npm](https://img.shields.io/npm/v/vue-cli-plugin-eruda.svg)](https://www.npmjs.com/package/vue-cli-plugin-eruda)
[![npm](https://img.shields.io/npm/l/vue-cli-plugin-eruda.svg)](https://www.npmjs.com/package/vue-cli-plugin-eruda)

> A Vue CLI 3+ plugin of [eruda](https://github.com/liriliri/eruda).

[English](https://github.com/XiongAmao/vue-cli-plugin-eruda#readme)

## 安装

使用一下命令安装插件，`Vue CLI`, 

```bash
npm install --save-dev vue-cli-plugin-eruda

# 如果你全局安装了Vue CLI
vue add erudu
```

## 全局变量

启用插件后，会提供一个全局变量用于调用[eruda](https://github.com/liriliri/eruda)的API. 

```js
var eruda = require("eruda");
window.eruda === undefined && (window.eruda = eruda);
```

## 插件选项

```js
// vue.config.js
module.exports = {
  // ... your configs 

  pluginOptions: {
    eruda: {
      // options
    }
  }
}
```

<table>
  <thead>
    <tr>
      <th>Options key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>enable</td>
      <td>boolean</td>
      <td>默认情况下，当NODE_ENV !== 'production'时开启插件. 你可以传true或者false去强制开启/关闭。</td>
    </tr>
    <tr>
      <td>exclude</td>
      <td>regexp | regexp[]</td>
      <td>用于排除你不需要注入eruda插件的入口文件(entry)。多页时使用(使用`vue.config.js`的`pages`选项定制)</td>
    </tr>
    <tr>
      <td>plugins</td>
      <td>string[]</td>
      <td>开启eruda插件。你可以传递完整包名['eruda-fps'] 或者简写['fps']。</td>
    </tr>
    <tr>
      <td>container</td>
      <td>element</td>
      <td>用于插件初始化的 Dom 元素，如果不设置，默认创建 div 作为容器直接置于 html 根结点下面。</td>
    </tr>
    <tr>
      <td>tool</td>
      <td>string[] | string</td>
      <td>指定要初始化哪些面板，默认加载所有。</td>
    </tr>
    <tr>
      <td>autoScale=true</td>
      <td>boolean</td>
      <td>自动缩放eruda以适应不同的viewport</td>
    </tr>
    <tr>
      <td>useShadowDom=true</td>
      <td>boolean</td>
      <td>使用shadowdom封装css</td>
    </tr>
  </tbody>
</table>

`container`, `tool`, `autoScale`, `useShadowDom` 是eruda默认配置项，你可以在[这里](https://github.com/liriliri/eruda/blob/master/doc/API.md)查看更多信息  。

## License

[MIT](http://opensource.org/licenses/MIT)
