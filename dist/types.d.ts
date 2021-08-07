import type webpack from 'webpack';
import { z } from 'zod';
export declare type Compiler = webpack.Compiler;
export declare type Compilation = webpack.compilation.Compilation;
export declare const Path: z.ZodEffects<z.ZodString, string>;
export declare type Path = z.infer<typeof Path>;
export declare const Export: z.ZodUnion<[z.ZodEffects<z.ZodString, string>, z.ZodObject<{
    from: z.ZodEffects<z.ZodString, string>;
    specifiers: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        name: z.ZodString;
        as: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        as?: string | undefined;
        name: string;
    }, {
        as?: string | undefined;
        name: string;
    }>]>, "atleastone">>;
}, "strip", z.ZodTypeAny, {
    specifiers?: [string | {
        as?: string | undefined;
        name: string;
    }, ...(string | {
        as?: string | undefined;
        name: string;
    })[]] | undefined;
    from: string;
}, {
    specifiers?: [string | {
        as?: string | undefined;
        name: string;
    }, ...(string | {
        as?: string | undefined;
        name: string;
    })[]] | undefined;
    from: string;
}>]>;
export declare type Export = z.infer<typeof Export>;
export declare const Options: z.ZodEffects<z.ZodObject<{
    filename: z.ZodDefault<z.ZodString>;
    imports: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodString, string>, "atleastone">>;
    exports: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodString, string>, z.ZodObject<{
        from: z.ZodEffects<z.ZodString, string>;
        specifiers: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            name: z.ZodString;
            as: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            as?: string | undefined;
            name: string;
        }, {
            as?: string | undefined;
            name: string;
        }>]>, "atleastone">>;
    }, "strip", z.ZodTypeAny, {
        specifiers?: [string | {
            as?: string | undefined;
            name: string;
        }, ...(string | {
            as?: string | undefined;
            name: string;
        })[]] | undefined;
        from: string;
    }, {
        specifiers?: [string | {
            as?: string | undefined;
            name: string;
        }, ...(string | {
            as?: string | undefined;
            name: string;
        })[]] | undefined;
        from: string;
    }>]>, "atleastone">>;
}, "strip", z.ZodTypeAny, {
    imports?: [string, ...string[]] | undefined;
    exports?: [string | {
        specifiers?: [string | {
            as?: string | undefined;
            name: string;
        }, ...(string | {
            as?: string | undefined;
            name: string;
        })[]] | undefined;
        from: string;
    }, ...(string | {
        specifiers?: [string | {
            as?: string | undefined;
            name: string;
        }, ...(string | {
            as?: string | undefined;
            name: string;
        })[]] | undefined;
        from: string;
    })[]] | undefined;
    filename: string;
}, {
    imports?: [string, ...string[]] | undefined;
    exports?: [string | {
        specifiers?: [string | {
            as?: string | undefined;
            name: string;
        }, ...(string | {
            as?: string | undefined;
            name: string;
        })[]] | undefined;
        from: string;
    }, ...(string | {
        specifiers?: [string | {
            as?: string | undefined;
            name: string;
        }, ...(string | {
            as?: string | undefined;
            name: string;
        })[]] | undefined;
        from: string;
    })[]] | undefined;
    filename?: string | undefined;
}>, {
    imports?: [string, ...string[]] | undefined;
    exports?: [string | {
        specifiers?: [string | {
            as?: string | undefined;
            name: string;
        }, ...(string | {
            as?: string | undefined;
            name: string;
        })[]] | undefined;
        from: string;
    }, ...(string | {
        specifiers?: [string | {
            as?: string | undefined;
            name: string;
        }, ...(string | {
            as?: string | undefined;
            name: string;
        })[]] | undefined;
        from: string;
    })[]] | undefined;
    filename: string;
}>;
export declare type Options = z.infer<typeof Options>;
