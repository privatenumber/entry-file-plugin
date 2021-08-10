import { RawSource } from 'webpack-sources';
import type { Plugin, Compiler, compilation as c } from 'webpack';
import WebpackError from 'webpack/lib/WebpackError.js';
import { Options, Path, Export } from './types';

type Compilation = c.Compilation;

const assert = (
	condition: any,
	message: string,
) => {
	if (!condition) {
		throw new Error(`[${EntryFilePlugin.name}] ${message}`);
	}
};

const hasEmitAsset = (compilation: Compilation): compilation is Compilation & {
	emitAsset: (name: string, source: RawSource) => void;
} => ('emitAsset' in compilation);

const emitAsset = (
	compilation: Compilation,
	assetName: string,
	source: string,
) => {
	assert(
		!compilation.assets[assetName],
		`[EntryFilePlugin] An asset with name "${assetName}" already exists`,
	);

	if (hasEmitAsset(compilation)) {
		compilation.emitAsset(
			assetName,
			new RawSource(source),
		);
	} else {
		compilation.assets[assetName] = {
			source: () => source,
			size: () => source.length,
		};
	}
};

const isPathPattern = /^\.\.?\//;

const hasAsset = (
	compilation: Compilation,
	importFrom: string,
	omitSourcesNotFound: boolean,
) => {
	if (!isPathPattern.test(importFrom)) {
		return true; // ignore bare specifiers
	}

	if (
		// eslint-disable-next-line no-prototype-builtins
		compilation.assets.hasOwnProperty(importFrom.replace(isPathPattern, ''))
	) {
		return true;
	}

	if (omitSourcesNotFound) {
		return false;
	}

	compilation.warnings.push(
		new WebpackError(`[${EntryFilePlugin.name}] Could not resolve path "${importFrom}"`),
	);
	return true;
};

class EntryFilePlugin implements Plugin {
	filename: string;

	omitSourcesNotFound: boolean;

	imports?: Path[];

	exports?: Export[];

	constructor(options: Options) {
		assert(options, 'Options must be passed in');

		this.filename = options.filename ?? 'index.js';
		this.omitSourcesNotFound = options.omitSourcesNotFound ?? false;

		assert(
			options.imports?.length || options.exports?.length,
			'Options must specify `imports` and/or `exports`',
		);

		this.imports = options.imports;
		this.exports = options.exports;
	}

	apply(compiler: Compiler) {
		compiler.hooks.thisCompilation.tap(EntryFilePlugin.name, (compilation) => {
			compilation.hooks.additionalAssets.tap(
				EntryFilePlugin.name,
				() => {
					this.onCompilation(compilation);
				},
			);
		});
	}

	createEntry(compilation: Compilation) {
		const {
			imports,
			exports,
			omitSourcesNotFound,
		} = this;
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
				} else {
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

	onCompilation(compilation: Compilation) {
		const source = this.createEntry(compilation);
		emitAsset(compilation, this.filename, source);
	}
}

export = EntryFilePlugin;
