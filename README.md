# entry-file-plugin <a href="https://npm.im/entry-file-plugin"><img src="https://badgen.net/npm/v/entry-file-plugin"></a> <a href="https://npm.im/entry-file-plugin"><img src="https://badgen.net/npm/dm/entry-file-plugin"></a> <a href="https://packagephobia.now.sh/result?p=entry-file-plugin"><img src="https://packagephobia.now.sh/badge?p=entry-file-plugin"></a>

Create an ESM entry-file in your Webpack build to consolidate entry-point exports

<sub>Support this project by ⭐️ starring and sharing it. [Follow me](https://github.com/privatenumber) to see what other cool projects I'm working on! ❤️</sub>

## 🙋‍♂️ Why?
For consolidating exports from Webpack builds that emit multiple entry-points.

A great use-case for this is Vue.js component builds that extract the CSS into a separate file. Even if the build bundles multiple components, by creating an entry-point that imports the CSS and re-exports the components, consuming applications can simply import from one path to get the appropriate styles.

## 🚀 Install
```sh
npm i -D entry-file-plugin
```

## 🚦 Quick setup

In `webpack.config.js`:

```diff
+ const EntryFilePlugin = require('entry-file-plugin')

  module.exports = {
    ...,

    plugins: [
      ...,
+     new EntryFilePlugin({
+       imports: [...], 
+       exports: [...]
+     })
    ]
  }
```

### Example
The following configuration:
```js
new EntryFilePlugin({
  imports: [
    './styles.css',
  ],
  exports: [
    './components.js',
  ],
})
```

Creates an `index.js` file:
```js
import "./styles.css";
export * from "./components.js";
```

## ⚙️ Options
### filename
Type: `string`

Default: `index.js`

The entry file name.

### imports
Type: `string[]`


An array of paths to import from.

### exports
Type:

```ts
type Specifier = (string | {
  name: string;
  as?: string;
})[];

type Exports = (string | {
  from: string;
  specifiers?: Specifier[];
})[];
```

An array of paths and names to export from.


## 👨‍👩‍👧 Related

- [rollup-plugin-aggregate-exports](https://github.com/privatenumber/rollup-plugin-aggregate-exports) - Similar plugin for Rollup
