import type { Plugin } from 'webpack';
import { Options, Path, Export, Compiler, Compilation } from './types';
declare class EntryFilePlugin implements Plugin {
    filename: string;
    imports?: Path[];
    exports?: Export[];
    constructor(options: Options);
    apply(compiler: Compiler): void;
    createEntry(): string;
    onCompilation(compilation: Compilation): void;
}
export = EntryFilePlugin;
