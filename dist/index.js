"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const webpack_sources_1 = require("webpack-sources");
const WebpackError_js_1 = __importDefault(require("webpack/lib/WebpackError.js"));
const assert = (condition, message) => {
    if (!condition) {
        throw new Error(`[${EntryFilePlugin.name}] ${message}`);
    }
};
const hasEmitAsset = (compilation) => ('emitAsset' in compilation);
const emitAsset = (compilation, assetName, source) => {
    assert(!compilation.assets[assetName], `[EntryFilePlugin] An asset with name "${assetName}" already exists`);
    if (hasEmitAsset(compilation)) {
        compilation.emitAsset(assetName, new webpack_sources_1.RawSource(source));
    }
    else {
        compilation.assets[assetName] = {
            source: () => source,
            size: () => source.length,
        };
    }
};
const isPathPattern = /^\.\.?\//;
const hasAsset = (compilation, importFrom, omitSourcesNotFound) => {
    if (!isPathPattern.test(importFrom)) {
        return true; // ignore bare specifiers
    }
    if (
    // eslint-disable-next-line no-prototype-builtins
    compilation.assets.hasOwnProperty(importFrom.replace(isPathPattern, ''))) {
        return true;
    }
    if (omitSourcesNotFound) {
        return false;
    }
    compilation.warnings.push(new WebpackError_js_1.default(`[${EntryFilePlugin.name}] Could not resolve path "${importFrom}"`));
    return true;
};
class EntryFilePlugin {
    constructor(options) {
        var _a, _b, _c, _d;
        assert(options, 'Options must be passed in');
        this.filename = (_a = options.filename) !== null && _a !== void 0 ? _a : 'index.js';
        this.omitSourcesNotFound = (_b = options.omitSourcesNotFound) !== null && _b !== void 0 ? _b : false;
        assert(((_c = options.imports) === null || _c === void 0 ? void 0 : _c.length) || ((_d = options.exports) === null || _d === void 0 ? void 0 : _d.length), 'Options must specify `imports` and/or `exports`');
        this.imports = options.imports;
        this.exports = options.exports;
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(EntryFilePlugin.name, (compilation) => {
            compilation.hooks.additionalAssets.tap(EntryFilePlugin.name, () => {
                this.onCompilation(compilation);
            });
        });
    }
    createEntry(compilation) {
        const { imports, exports, omitSourcesNotFound, } = this;
        let index = '';
        if (imports) {
            for (const importFrom of imports) {
                if (!hasAsset(compilation, importFrom, omitSourcesNotFound)) {
                    continue;
                }
                index += `import "${importFrom}";`;
            }
        }
        if (exports) {
            for (const exportData of exports) {
                if (typeof exportData === 'string') {
                    if (!hasAsset(compilation, exportData, omitSourcesNotFound)) {
                        continue;
                    }
                    index += `export * from "${exportData}";`;
                }
                else {
                    const { from, specifiers } = exportData;
                    if (!hasAsset(compilation, from, omitSourcesNotFound)) {
                        continue;
                    }
                    let exportValues = '*';
                    if (specifiers) {
                        exportValues = specifiers.map((specifier) => {
                            if (typeof specifier === 'string') {
                                return specifier;
                            }
                            let importSpecifier = specifier.name;
                            if (specifier.as) {
                                importSpecifier += ` as ${specifier.as}`;
                            }
                            return importSpecifier;
                        }).join(',');
                        exportValues = `{${exportValues}}`;
                    }
                    index += `export ${exportValues} from "${from}";`;
                }
            }
        }
        return index;
    }
    onCompilation(compilation) {
        const source = this.createEntry(compilation);
        emitAsset(compilation, this.filename, source);
    }
}
module.exports = EntryFilePlugin;
