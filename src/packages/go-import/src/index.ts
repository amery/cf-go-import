export interface GoImport {
	readonly host: string;
	readonly path: string;

	importPath(): string;
	matchPath(root: string): boolean;
}

export interface RepoRoot {
	vcs: string;
	repo: string;
	root: string;
}

export function MatchPath(pkg: GoImport, path: string): boolean {
	if (path == "") {
		// everything matches the root
		return true;
	}

	path = "/" + path;
	if (pkg.path.startsWith(path)) {
		const rest = pkg.path.substring(path.length);
		if (rest == "" || rest[0] == "/") {
			return true;
		}
	}
	return false;
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
			matchPath(path: string): boolean {
				return MatchPath(this, path);
			},
		};
	}
	return null;
}
