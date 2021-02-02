import { regex, regexEscape } from 'fancy-regex'
import { ALL_URLS } from './constants'
import { getHostRegex } from './getHostRegex'
import { getPatternSegments } from './getPatternSegments'
import { MatchPatternOptions } from './types'
import { createMatchFn, normalizeUrlFragment } from './utils'

export const toMatchFnOrError = (
	pattern: string,
	options: Required<MatchPatternOptions>,
) => {
	const { supportedSchemes, schemeStarMatchesWs, strict } = options

	if (pattern === ALL_URLS) {
		return createMatchFn(url => {
			return regex`
				^
					(?:${supportedSchemes.map(regexEscape).join('|')})
					:
				$
			`.test(url.protocol)
		})
	}

	const patternSegments = getPatternSegments(pattern)

	if (!patternSegments) {
		return new Error(`Pattern ${pattern} is invalid`)
	}

	const { scheme, rawPathAndQuery } = patternSegments

	/* Scheme */

	if (
		scheme !== '*' &&
		!supportedSchemes.includes(scheme as typeof supportedSchemes[number])
	) {
		return new Error(`Scheme ${scheme} not supported`)
	}

	const schemeRegex = regex`${
		scheme === '*'
			? ['https?', schemeStarMatchesWs && 'wss?']
					.filter(Boolean)
					.join('|')
			: scheme
	}:`

	/* Host */

	const hostRegex = getHostRegex(patternSegments)

	if (hostRegex instanceof Error) {
		return hostRegex
	}

	/* Path and query string */

	// Non-strict used for host permissions.
	// "The path must be present in a host permission, but is always treated as /*."
	// See https://developer.chrome.com/docs/extensions/mv3/match_patterns/
	const pathAndQuery = strict ? normalizeUrlFragment(rawPathAndQuery) : '/*'

	if (pathAndQuery instanceof Error) {
		return pathAndQuery
	}

	const pathAndQueryRegex = regex`^${pathAndQuery
		.split('*')
		.map(x => regexEscape(x))
		.join('.*')}$`

	return createMatchFn(url => {
		// respect zero-search-string
		const pathAndQuery =
			url.pathname + (url.href.endsWith('?') ? '?' : url.search)

		return (
			schemeRegex.test(url.protocol) &&
			hostRegex.test(url.host) &&
			pathAndQueryRegex.test(pathAndQuery)
		)
	})
}
