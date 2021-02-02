import { regex } from 'fancy-regex'
import { PatternSegments } from './types'

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

export const getPatternSegments = (pattern: string): PatternSegments | null => {
	if (pattern === '<all_urls>') {
		return {
			pattern,
			scheme: '*',
			rawHost: '*',
			rawPathAndQuery: '/*',
		}
	}

	const m = pattern.match(patternRegex)

	if (!m) return null

	const [, /* fullMatch */ scheme, rawHost, rawPathAndQuery] = m

	return {
		pattern,
		scheme,
		rawHost,
		rawPathAndQuery,
	}
}
