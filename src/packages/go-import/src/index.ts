export interface GoImport {
	readonly host: string;
	readonly path: string;

	importPath(): string;
}

export interface RepoRoot {
	vcs: string;
	repo: string;
	root: string;
}

export function URLAsGoImport(url: string): GoImport | null {
	const { hostname: host, pathname: path, searchParams: qs } = new URL(url);
	if (qs.get("go-get") === "1") {
		return {
			host,
			path: path.replace(/\/+$/, ""),

			importPath() {
				if (this.path) {
					return this.host + this.path;
				}
				return this.host;
			},
		};
	}
	return null;
}
