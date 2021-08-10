import type { Plugin, Compiler, compilation as c } from 'webpack';
import { Options, Path, Export } from './types';
declare type Compilation = c.Compilation;
declare class EntryFilePlugin implements Plugin {
    filename: string;
    omitSourcesNotFound: boolean;
    imports?: Path[];
    exports?: Export[];
    constructor(options: Options);
    apply(compiler: Compiler): void;
    createEntry(compilation: Compilation): string;
    onCompilation(compilation: Compilation): void;
}
export = EntryFilePlugin;
