"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const assert_1 = __importDefault(require("assert"));
const webpack_sources_1 = require("webpack-sources");
const aggregate_error_1 = __importDefault(require("aggregate-error"));
const types_1 = require("./types");
const hasEmitAsset = (compilation) => ('emitAsset' in compilation);
const emitAsset = (compilation, assetName, source) => {
    assert_1.default(!compilation.assets[assetName], `[EntryFilePlugin] An asset with name "${assetName}" already exists`);
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
class EntryFilePlugin {
    constructor(options) {
        const parsed = types_1.Options.safeParse(options);
        if (!parsed.success) {
            const { _errors } = parsed.error.format();
            throw new aggregate_error_1.default(_errors);
        }
        const { data } = parsed;
        this.filename = data.filename;
        this.imports = data.imports;
        this.exports = data.exports;
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(EntryFilePlugin.name, (compilation) => {
            compilation.hooks.additionalAssets.tap(EntryFilePlugin.name, () => {
                this.onCompilation(compilation);
            });
        });
    }
    createEntry() {
        const { imports, exports } = this;
        let index = '';
        if (imports) {
            for (const importFrom of imports) {
                index += `import "${importFrom}";`;
            }
        }
        if (exports) {
            for (const exportData of exports) {
                if (typeof exportData === 'string') {
                    index += `export * from "${exportData}";`;
                }
                else {
                    const { from, specifiers } = exportData;
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
        const source = this.createEntry();
        emitAsset(compilation, this.filename, source);
    }
}
module.exports = EntryFilePlugin;
