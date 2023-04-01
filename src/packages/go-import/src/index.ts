export interface GoImport {
	package: string;
}

export function URLAsGoImport(url: string): GoImport | null {
	const { hostname, pathname, searchParams: qs } = new URL(url);
	if (qs.get("go-get") === "1") {
		const pkg = `${hostname}${pathname}`;
		return {
			package: pkg.endsWith("/") ? pkg.slice(0, -1) : pkg,
		};
	}
	return null;
}

export default {};
