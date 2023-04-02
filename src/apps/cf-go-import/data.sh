#!/bin/sh

set -eu

: ${WRANGLER:=wrangler}

EXTRA_ARGS="$*"

GITHUB=https://github.com
BINDING=NAMESPACE

render() {
	local domain="$1" base="$2"
	local x=
	shift 2

	for x; do
		echo "$x:$domain${x:+/$x}::$base${x:+/$x}"
	done
}

put() {
	local domain="$1" value=

	value="$(render "$@")"

	cat <<-EOT
	# $domain
	#
	EOT
	$WRANGLER kv:key put "$domain" "$value" --binding "$BINDING"${EXTRA_ARGS:+ $EXTRA_ARGS}
}

# goshop
put goshop.dev "$GITHUB/goshop-project" \
	headless

# darvaza
put darvaza.org "$GITHUB/darvaza-proxy" \
	acmefy \
	cache \
	core \
	darvaza \
	gossipcache \
	middleware \
	slog \
