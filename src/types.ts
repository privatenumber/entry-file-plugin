type Identifier = string;

type Specifier = Identifier | {
	name: Identifier;
	as?: Identifier;
};

export type Path = string;

export type Export = Path | {
	from: Path;
	specifiers?: Specifier[];
};

export type Options = {
	filename?: string;
	imports?: Path[];
	exports?: Export[];
	omitSourcesNotFound?: boolean;
};
