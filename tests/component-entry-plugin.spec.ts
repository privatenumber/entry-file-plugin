import ComponentEntryPlugin from '../src/index';
import { build } from './utils';

const isWp5 = process.env.WEBPACK === '5';

describe(`Webpack ${isWp5 ? 5 : 4}`, () => {
	describe('Error cases', () => {
		test('no options', async () => {
			await expect(async () => {
				await build({
					'/src/index.js': 'export default "some export"',
				}, (config) => {
					config.output.filename = 'index.js';
					config.plugins.push(
						// @ts-expect-error to test error
						new ComponentEntryPlugin(),
					);
				});
			}).rejects.toThrow('Required');
		});

		test('no import or export', async () => {
			await expect(async () => {
				await build({
					'/src/index.js': 'export default "some export"',
				}, (config) => {
					config.output.filename = 'index.js';
					config.plugins.push(
						new ComponentEntryPlugin({}),
					);
				});
			}).rejects.toThrow('Options must specify `imports` and/or `exports` array');
		});

		test('asset collision', async () => {
			await expect(async () => {
				await build({
					'/src/index.js': 'export default "some export"',
				}, (config) => {
					config.output.filename = 'index.js';
					config.plugins.push(
						new ComponentEntryPlugin({
							exports: ['./index.js'],
						}),
					);
				});
			}).rejects.toThrow(/already exists/);
		});
	});

	describe('use-cases', () => {
		test('basic', async () => {
			const { mfs } = await build({
				'/src/index.js': 'export default "some export"',
			}, (config) => {
				config.output.filename = 'script.js';
				config.plugins.push(
					new ComponentEntryPlugin({
						imports: ['./style.css'],
						exports: [
							'./script.js',
							{
								from: './script.js',
							},
							{
								from: './script.js',
								specifiers: [
									'a',
									{
										name: 'b',
									},
									{
										name: 'c',
										as: 'd',
									},
								],
							},
						],
					}),
				);
			});

			expect(mfs.readFileSync('/dist/index.js').toString()).toBe(
				'import "./style.css";export * from "./script.js";export * from "./script.js";export {a,b,c as d} from "./script.js";',
			);
		});

		if (isWp5) {
			test('minifies', async () => {
				const { mfs } = await build({
					'/src/index.js': 'export default 1  +  1',
				}, (config) => {
					config.optimization.minimize = true;
					config.output.filename = 'script.js';
					config.plugins.push(
						new ComponentEntryPlugin({
							imports: ['./style.css'],
							exports: [
								'./script.js',
								{
									from: './script.js',
								},
								{
									from: './script.js',
									specifiers: [
										'a',
										{
											name: 'b',
										},
										{
											name: 'c',
											as: 'd',
										},
									],
								},
							],
						}),
					);
				});

				expect(mfs.readFileSync('/dist/index.js').toString()).toBe(
					'import"./style.css";export*from"./script.js";export*from"./script.js";export{a,b,c as d}from"./script.js";',
				);
			});
		}
	});
});
