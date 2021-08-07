import fs from 'fs';
import path from 'path';
import webpack, { Stats, OutputFileSystem } from 'webpack';
import { ufs } from 'unionfs';
import { IFS } from 'unionfs/lib/fs.js';
import { Volume, DirectoryJSON } from 'memfs';
import AggregateError from 'aggregate-error';

const mfsFromJson = (volJson: DirectoryJSON): webpack.OutputFileSystem => {
	const mfs = Volume.fromJSON(volJson) as unknown as OutputFileSystem;
	mfs.join = path.join;
	return mfs;
};

type CompilerOptions = Partial<webpack.Compiler>;
class ConfigureCompilerPlugin {
	options: CompilerOptions;

	constructor(options: CompilerOptions) {
		this.options = options;
	}

	apply(compiler: webpack.Compiler) {
		Object.assign(compiler, this.options);
	}
}

type WebpackFS = webpack.OutputFileSystem & FileSystem & {
	writeFileSync: typeof fs.writeFileSync;
};

function assertFsWithReadFileSync(
	mfs: webpack.InputFileSystem | webpack.OutputFileSystem,
): asserts mfs is WebpackFS {
	if (!('readFileSync' in mfs)) {
		throw new Error('Missing readFileSync');
	}
	if (!('writeFileSync' in mfs)) {
		throw new Error('Missing writeFileSync');
	}
}

export const build = (
	volJson: DirectoryJSON,
	configCallback: (config: webpack.Configuration) => void,
) => new Promise<{
	stats: Stats;
	mfs: WebpackFS;
}>((resolve, reject) => {
	const mfs = mfsFromJson(volJson);
	const config: webpack.Configuration = {
		mode: 'production',
		target: 'node',
		entry: {
			index: '/src/index.js',
		},
		module: {
			rules: [],
		},
		optimization: {
			minimize: false,
		},
		output: {
			path: '/dist',
			libraryTarget: 'commonjs2',
			// libraryExport: 'default',
		},
		plugins: [
			/**
			 * Inject memfs into the compiler before internal dependencies initialize
			 * (eg. PackFileCacheStrategy)
			 *
			 * https://github.com/webpack/webpack/blob/068ce839478317b54927d533f6fa4713cb6834da/lib/webpack.js#L69-L77
			 */
			new ConfigureCompilerPlugin({
				inputFileSystem: ufs.use(fs).use(mfs as unknown as IFS),
				outputFileSystem: mfs,
			}),
		],
	};

	if (configCallback) {
		configCallback(config);
	}

	const compiler = webpack(config);

	compiler.run((error, stats) => {
		if (error) {
			reject(error);
			return;
		}

		if (stats.hasErrors()) {
			reject(new AggregateError(stats.compilation.errors));
			return;
		}

		const { outputFileSystem } = stats.compilation.compiler;

		assertFsWithReadFileSync(outputFileSystem);
		resolve({
			stats,
			mfs: outputFileSystem,
		});
	});
});
