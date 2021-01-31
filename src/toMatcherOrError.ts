import { regex, regexEscape } from 'fancy-regex'
import { Matcher, MatcherPatternOptions } from './types'

const patternRegex = regex`
	^
		(\*|https?|wss?|ftps?|data|file)   # scheme
		://
		(
			\* |           # Any host
			\*\.[^/:]+ |   # The given host and any of its subdomains
			[^/*:]*        # Only the given host (optional only if file scheme)
		)
		(/.*)              # path
	$
`

const createMatcher = (fn: (url: URL) => boolean): Matcher => (
	url: string | URL,
) => {
	let $url: URL

	try {
		$url = url instanceof URL ? url : new URL(url)
	} catch (_e) {
		return false
	}

	return fn($url)
}

export const toMatcherOrError = (options: Required<MatcherPatternOptions>) => (
	pattern: string,
) => {
	const { supportedSchemes, schemeStarMatchesWs, strict } = options

	if (pattern === '<all_urls>') {
		return createMatcher(url =>
			regex`${supportedSchemes.join('|')}:`.test(url.protocol),
		)
	}

	try {
		const urlStr = pattern.split('*').join('a')
		const url = new URL(urlStr)

		if (/[^.a-z0-9-]/.test(url.host)) {
			return new Error(`${pattern} host contains invalid characters`)
		}
	} catch (_e) {
		return new Error(`${pattern} cannot be used to create a valid URL`)
	}

	const m = pattern.match(patternRegex)

	if (!m) return new Error(`${pattern} is invalid`)

	const [_, scheme, host, _pathAndQuery] = m

	// The path must be present in a host permission, but is ignored
	const pathAndQuery = strict ? _pathAndQuery : '/*'

	if (
		scheme !== '*' &&
		!supportedSchemes.includes(scheme as typeof supportedSchemes[number])
	) {
		return new Error(`scheme ${scheme} not supported`)
	}

	if (!host && scheme !== 'file') {
		return new Error('host is optional only if the scheme is "file".')
	}

	const schemeRegex = regex`${
		scheme === '*'
			? ['https?', schemeStarMatchesWs && 'wss?']
					.filter(Boolean)
					.join('|')
			: scheme
	}:`

	let hostRegex: RegExp

	if (host === '*') {
		hostRegex = /.+/
	} else if (host.includes('*')) {
		const segments = host.split('*.')

		if (segments.length !== 2 || segments[0] || !segments[1]) {
			return new Error(
				'partial-wildcard host must be of form *.<host segments>',
			)
		}

		hostRegex = regex`^(?:[^.]+\.)*${regexEscape(host.slice(2))}$`
	} else {
		hostRegex = regex`^${regexEscape(host)}$`
	}

	const pathAndQueryRegex =
		pathAndQuery === '/'
			? /^\/$/
			: regex`^${pathAndQuery
					.split('*')
					.map(x => regexEscape(x))
					.join('.*')}$`

	return createMatcher(url => {
		return (
			schemeRegex.test(url.protocol) &&
			hostRegex.test(url.host) &&
			pathAndQueryRegex.test(url.pathname + url.search)
		)
	})
}
