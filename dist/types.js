"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = exports.Export = exports.Path = void 0;
const zod_1 = require("zod");
const SpecifierString = zod_1.z.string().min(1, {
    message: 'Specifier is required',
});
const Specifier = zod_1.z.union([
    SpecifierString,
    zod_1.z.object({
        name: SpecifierString,
        as: SpecifierString.optional(),
    }),
]);
exports.Path = zod_1.z.string().min(1, {
    message: 'Path is required',
}).refine(path => !path.startsWith('/'), {
    message: 'Path can only be relative or a bare specifier',
});
exports.Export = zod_1.z.union([
    exports.Path,
    zod_1.z.object({
        from: exports.Path,
        specifiers: zod_1.z.array(Specifier).nonempty({
            message: 'Specifiers array empty',
        }).optional(),
    }),
]);
exports.Options = zod_1.z.object({
    filename: zod_1.z.string().min(1).default('index.js'),
    imports: zod_1.z.array(exports.Path).nonempty().optional(),
    exports: zod_1.z.array(exports.Export).nonempty().optional(),
}).refine(options => { var _a, _b; return ((_a = options.imports) === null || _a === void 0 ? void 0 : _a.length) || ((_b = options.exports) === null || _b === void 0 ? void 0 : _b.length); }, {
    message: 'Options must specify `imports` and/or `exports` array',
});
