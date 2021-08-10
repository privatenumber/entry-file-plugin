declare type Identifier = string;
declare type Specifier = Identifier | {
    name: Identifier;
    as?: Identifier;
};
export declare type Path = string;
export declare type Export = Path | {
    from: Path;
    specifiers?: Specifier[];
};
export declare type Options = {
    filename?: string;
    imports?: Path[];
    exports?: Export[];
    omitSourcesNotFound?: boolean;
};
export {};
