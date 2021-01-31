import { regex, regexEscape } from 'fancy-regex'
import { getHostRegex } from './getHostRegex'
import { MatcherPatternOptions, PatternData } from './types'
import { createMatcher, normalizeUrlFragment } from './utils'

const patternRegex = regex`
	^
		(\*|https?|wss?|ftps?|data|file)   # scheme
		://
		(
			\*          |  # Any host
			\*\.[^/:]+  |  # The given host and any of its subdomains
			[^/*:]*        # Only the given host (optional only if file scheme)
		)
		(/.*)              # path
	$
`

export const toMatcherOrError = (
	pattern: string,
	options: Required<MatcherPatternOptions>,
) => {
	const { supportedSchemes, schemeStarMatchesWs, strict } = options

	if (pattern === '<all_urls>') {
		return createMatcher(url => {
			return regex`
				^
					(?:${supportedSchemes.map(regexEscape).join('|')})
					:
				$
			`.test(url.protocol)
		})
	}

	const m = pattern.match(patternRegex)

	if (!m) return new Error(`pattern ${pattern} is invalid`)

	const [, /* fullMatch */ scheme, rawHost, rawPathAndQuery] = m

	const patternData: PatternData = {
		pattern,
		scheme,
		rawHost,
		rawPathAndQuery,
	}

	/* Scheme */

	if (
		scheme !== '*' &&
		!supportedSchemes.includes(scheme as typeof supportedSchemes[number])
	) {
		return new Error(`scheme ${scheme} not supported`)
	}

	const schemeRegex = regex`${
		scheme === '*'
			? ['https?', schemeStarMatchesWs && 'wss?']
					.filter(Boolean)
					.join('|')
			: scheme
	}:`

	/* Host */

	const hostRegex = getHostRegex(patternData)

	if (hostRegex instanceof Error) {
		return hostRegex
	}

	/* Path and query string */

	// Non-strict used for host permissions.
	// "The path must be present in a host permission, but is always treated as /*."
	// See https://developer.chrome.com/docs/extensions/mv3/match_patterns/
	const pathAndQuery = strict ? normalizeUrlFragment(rawPathAndQuery) : '/*'

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
