import * as go from "@licensly/go-import";

export interface Env {
	NAMESPACE: KVNamespace;
}

async function goGetHandler(pkg: go.GoImport, env: Env): Promise<Response> {
	// TODO: handle pagination
	const roots = await env.NAMESPACE.get(pkg.host);
	if (roots) {
		for (const row of roots.split("\n")) {
			;
		}
	}

	return new Response("Not Found", {
		status: 404,
	});
}

async function requestHandler(request: Request, env: Env): Promise<Response> {
	if (request.method === "GET") {
		// TODO: cache
		const pkg = go.URLAsGoImport(request.url);
		if (pkg) {
			return goGetHandler(pkg, env);
		}
	}

	// pass through
	return fetch(request);
}

const worker: ExportedHandler<Env> = {
	fetch: requestHandler,
};

export default worker;
