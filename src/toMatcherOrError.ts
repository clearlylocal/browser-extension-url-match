import { regex, RegexFragment, regexEscape } from 'fancy-regex'
import { ALL_URLS } from './constants'
import { getHostRegex } from './getHostRegex'
import { getPatternSegments } from './getPatternSegments'
import { MatchPatternOptions } from './types'
import { createMatchFn, normalizeUrlFragment } from './utils'

export function toMatchFnOrError(
	pattern: string,
	options: Required<MatchPatternOptions>,
) {
	const { supportedSchemes, schemeStarMatchesWs, strict } = options

	if (pattern === ALL_URLS) {
		return createMatchFn((url) => {
			return regex()`
				^
					(?:${supportedSchemes})
					:
				$
			`.test(url.protocol)
		})
	}

	const unsupportedScheme = pattern.match(/^(urn|data):/)?.[1]

	if (unsupportedScheme) {
		return new TypeError(
			`browser-extension-url-match does not currently support scheme "${unsupportedScheme}"`,
		)
	}

	const patternSegments = getPatternSegments(pattern)

	if (!patternSegments) {
		try {
			const url = new URL(pattern)

			if (url.hash || url.href.endsWith('#')) {
				return new TypeError(
					`Pattern cannot contain a hash: "${pattern}" contains hash "${url.hash || '#'}"`,
				)
			}

			if (!pattern.slice(url.origin.length).startsWith('/')) {
				return new TypeError(
					`Pattern "${pattern}" does not contain a path. Use "${pattern}/*" to match any paths with that origin or "${pattern}/" to match that URL alone`,
				)
			}
		} catch {
			/* fall back to generic err */
		}

		return new TypeError(`Pattern "${pattern}" is invalid`)
	}

	const { scheme, rawPathAndQuery } = patternSegments

	/* Scheme */
	if (
		scheme !== '*' &&
		!supportedSchemes.includes(scheme as (typeof supportedSchemes)[number])
	) {
		return new TypeError(`Scheme "${scheme}" is not supported`)
	}

	const schemeRegex = regex()`${
		scheme === '*'
			? new RegexFragment(
					['https?', schemeStarMatchesWs && 'wss?']
						.filter(Boolean)
						.join('|'),
				)
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

	const pathAndQueryRegex = regex()`^${new RegexFragment(
		pathAndQuery
			.split('*')
			.map((x) => regexEscape(x))
			.join('.*'),
	)}$`

	return createMatchFn((url) => {
		// respect zero-search-string
		const pathAndQuery =
			url.pathname + (url.href.endsWith('?') ? '?' : url.search)

		return (
			schemeRegex.test(url.protocol) &&
			// test against `url.hostname`, not `url.host`, as port is ignored
			hostRegex.test(url.hostname) &&
			pathAndQueryRegex.test(pathAndQuery)
		)
	})
}
