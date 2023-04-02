import * as go from "@licensly/go-import";

export interface Env {
	NAMESPACE: KVNamespace;
}

type RepoRootEntry = {
	path: string;
	root: go.RepoRoot;
};

// slog:go-import.jpi.workers.dev/slog::https://github.com/darvaza-proxy/slog
// ^--path ^-- root              vcs -^  url --^
function parseRepoRootRow(host: string, row: string): RepoRootEntry | null {
	const m = splitN(":", row, 4);

	if (m?.length == 4) {
		return {
			path: m[0],
			root: {
				root: m[1],
				vcs: m[2],
				repo: m[3],
			},
		};
	}

	console.log("parse_error", row);
	return null;
}

function splitN(
	del: string,
	data: string,
	count: number
): Array<string> | null {
	let base = 0;
	const out: Array<string> = [];

	while (count--) {
		let value: string;
		const pos = data.indexOf(del, base);

		if (count == 0 || pos < 0) {
			// last
			value = data.substring(base);
		} else {
			value = data.substring(base, pos);
			base = pos + 1;
		}

		out.push(value);
	}

	return out;
}

async function goGetResponse(
	pkg: go.GoImport,
	root: go.RepoRoot
): Promise<Response> {
	const refresh = 5;
	const meta = go.MetaTag(root);
	const path = pkg.importPath();
	const docs = `https://pkg.go.dev/${path}`;
	const repo = root.repo;

	return new Response(
		`<!DOCTYPE html>
<head>
	${meta}
	<meta http-equiv="refresh" content="${refresh}; url=${docs}" />
</head>
<body>
	<pre>git clone <a href="${repo}">${repo}</a></pre>
	<pre>go get <a href="${path}">${path}</a><pre>
	<pre>import "<a href="${path}">${path}</a>"</pre>
</body>
`,
		{
			headers: {
				["Content-Type"]: "text/html; charset=utf-8",
			},
		}
	);
}

async function redirectResponse(pkg: go.GoImport): Promise<Response> {
	const path = pkg.importPath();
	const docs = `https://pkg.go.dev/${path}`;

	return new Response(`redirecting to ${docs}`, {
		status: 302,
		headers: {
			["Location"]: docs,
		},
	});
}

async function requestHandler(request: Request, env: Env): Promise<Response> {
	const {
		hostname: host,
		pathname: path,
		searchParams: qs,
	} = new URL(request.url);
	const roots = await env.NAMESPACE.get(host);
	if (roots) {
		const pkg = go.NewGoImport(host, path);

		for (const row of roots.split("\n")) {
			const root = parseRepoRootRow(pkg.host, row);

			if (root && pkg.matchPath(root.path)) {
				if (qs.get("go-get") === "1") {
					return goGetResponse(pkg, root.root);
				} else {
					return redirectResponse(pkg);
				}
			}
		}

		// not found, pass to origin
	} else if (qs.get("go-get") === "1") {
		// not supported domain
		return new Response("Not Found", {
			status: 404,
		});
	}

	// pass through
	return fetch(request);
}

const worker: ExportedHandler<Env> = {
	fetch: requestHandler,
};

export default worker;
