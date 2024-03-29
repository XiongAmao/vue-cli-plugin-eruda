# vue-cli-plugin-eruda

[![npm](https://img.shields.io/npm/v/vue-cli-plugin-eruda.svg)](https://www.npmjs.com/package/vue-cli-plugin-eruda)
[![npm](https://img.shields.io/npm/l/vue-cli-plugin-eruda.svg)](https://www.npmjs.com/package/vue-cli-plugin-eruda)

> A Vue CLI 3+ plugin of [eruda](https://github.com/liriliri/eruda).

[中文文档](https://github.com/XiongAmao/vue-cli-plugin-eruda/blob/master/README.zh-CN.md)

## Installation

Install under a project created by `Vue CLI`, It will automatically load this plugin.

```bash
npm install --save-dev vue-cli-plugin-eruda

# If Vue CLI is installed globally
vue add erudu
```

## Global variable

After injection, a global variable will be provided for calling [eruda](https://github.com/liriliri/eruda) API.

```js
var eruda = require("eruda");
window.eruda === undefined && (window.eruda = eruda);
```

## Options

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
      <td>When NODE_ENV !== 'production' plugin is enabled by default. You can pass true/false to force it to be enabled.</td>
    </tr>
    <tr>
      <td>exclude</td>
      <td>regexp | regexp[]</td>
      <td>Used to exclude entries which you don't want to inject eruda. For example you are using "pages" option in vue.config.js</td>
    </tr>
    <tr>
      <td>plugins</td>
      <td>string[]</td>
      <td>Passing plugin name to enable eruda plugin. You can use full module(['eruda-fps']) or shorthand(e.g. ['fps'] )</td>
    </tr>
    <tr>
      <td>container</td>
      <td>element</td>
      <td>Container element. If not set, it will append an element directly under html root element</td>
    </tr>
    <tr>
      <td>tool</td>
      <td>string[] | string</td>
      <td>Choose which eruda's tools you want, by default all will be added.</td>
    </tr>
    <tr>
      <td>autoScale=true</td>
      <td>boolean</td>
      <td>Auto scale eruda for different viewport settings.</td>
    </tr>
    <tr>
      <td>useShadowDom=true</td>
      <td>boolean</td>
      <td>Use shadow dom for css encapsulation.</td>
    </tr>
    <tr>
      <td>defaults	</td>
      <td>object</td>
      <td>Default settings.</td>
    </tr>
  </tbody>
</table>

Available `defaults` settings:
|Name        |Type  |Desc                                         |
|------------|------|---------------------------------------------|
|transparency|number|Transparency, 0 to 1                         |
|displaySize |number|Display size, 0 to 100                       |
|theme       |string|Theme, defaults to Light or Dark in dark mode|


`container`, `tool`, `autoScale`, `useShadowDom`, `defaults` are eruda's default configuration. You can check [document](https://github.com/liriliri/eruda/blob/master/doc/API.md) for more information.

## License

[MIT](http://opensource.org/licenses/MIT)
