import type WP4 from 'webpack';
import type WP5 from 'webpack5';
import { z } from 'zod';

export type Compiler = WP4.Compiler | WP5.Compiler;
export type Compilation = WP4.compilation.Compilation | WP5.Compilation;

const SpecifierString = z.string().min(1, {
	message: 'Specifier is required',
});
const Specifier = z.union([
	SpecifierString,
	z.object({
		name: SpecifierString,
		as: SpecifierString.optional(),
	}),
]);

export const Path = z.string().min(1, {
	message: 'Path is required',
}).refine(
	path => !path.startsWith('/'),
	{
		message: 'Path can only be relative or a bare specifier',
	},
);

export type Path = z.infer<typeof Path>;

export const Export = z.union([
	Path,
	z.object({
		from: Path,
		specifiers: z.array(Specifier).nonempty({
			message: 'Specifiers array empty',
		}).optional(),
	}),
]);

export type Export = z.infer<typeof Export>;

export const Options = z.object({
	filename: z.string().min(1).default('index.js'),
	imports: z.array(Path).nonempty().optional(),
	exports: z.array(Export).nonempty().optional(),
}).refine(
	options => options.imports?.length || options.exports?.length,
	{
		message: 'Options must specify `imports` and/or `exports` array',
	},
);

export type Options = z.infer<typeof Options>;
