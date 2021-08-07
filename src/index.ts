import assert from 'assert';
import { RawSource } from 'webpack-sources';
import AggregateError from 'aggregate-error';
import type { Plugin } from 'webpack';
import {
	Options, Path, Export, Compiler, Compilation,
} from './types';

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

class EntryFilePlugin implements Plugin {
	filename: string;

	imports?: Path[];

	exports?: Export[];

	constructor(options: Options) {
		const parsed = Options.safeParse(options);

		if (!parsed.success) {
			const { _errors } = parsed.error.format();
			throw new AggregateError(_errors);
		}

		const { data } = parsed;
		this.filename = data.filename;
		this.imports = data.imports;
		this.exports = data.exports;
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
				} else {
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

	onCompilation(compilation: Compilation) {
		const source = this.createEntry();
		emitAsset(compilation, this.filename, source);
	}
}

export = EntryFilePlugin;
