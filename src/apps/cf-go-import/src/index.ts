/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import * as go from "@licensly/go-import";

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

async function goGetHandler(pkg: go.GoImport, env: Env): Promise<Response> {
	return new Response("Not Found", {
		status: 404,
	});
}

async function requestHandler(request: Request, env: Env): Promise<Response> {
	if (request.method === "GET") {
		const pkg = go.URLAsGoImport(request.url);
		if (pkg) {
			return goGetHandler(pkg, env);
		}
	}

	// pass through
	return fetch(request)
}

const worker: ExportedHandler<Env> = {
	fetch: requestHandler,
};

export default worker;
