import { regex } from 'fancy-regex'
import { PatternSegments } from './types'
import { ALL_URLS } from './constants'

const patternRegex = regex()`
	^
		(\*|\w+)      # scheme
		://
		(
			\*     |  # Any host
			[^/]*     # Only the given host (optional only if scheme is file)
		)
		(/[^\r\n\#]*) # path
	$
`

export function getPatternSegments(pattern: string): PatternSegments | null {
	if (pattern === ALL_URLS) {
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
