#!/bin/sh

set -eu

WORKER_NAME=
KV_NAMESPACE=35994a84f5344913b174a27ba4fcd445
KV_NAMESPACE_PREVIEW=180c178596f141dcb1653f314f278117

KV_BINDING="binding = \"NAMESPACE\""
KV_BINDING="${KV_BINDING}${KV_NAMESPACE:+, id = \"$KV_NAMESPACE\"}"
KV_BINDING="${KV_BINDING}${KV_NAMESPACE_PREVIEW:+, preview_id = \"$KV_NAMESPACE_PREVIEW\"}"

TOML=${0%.sh}.toml

cat <<EOT > "$TOML~"
name = "${WORKER_NAME:-go-import}"
main = "src/index.ts"
compatibility_date = "2023-03-31"

kv_namespaces = [
	{$KV_BINDING},
]
EOT

mv "$TOML~" "$TOML"
