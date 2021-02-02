import { WWW } from './constants'
import { getDummyUrl } from './getDummyUrl'
import { getPatternSegments } from './getPatternSegments'
import { MatchPatternOptions } from './types'
import { uniq } from './utils'

export const getExampleUrls = (
	pattern: string,
	options: Required<MatchPatternOptions>,
) => {
	const patternSegments = getPatternSegments(pattern)!
	const { supportedSchemes, strict } = options

	const subdomains = ['', WWW, 'foo.bar']
	const rootDomains = ['example.com']
	const pathAndQueryReplacers = ['', '-foo-', '/bar/baz/']

	const all = supportedSchemes.flatMap(defaultScheme =>
		subdomains.flatMap(subdomain =>
			rootDomains.flatMap(rootDomain =>
				pathAndQueryReplacers.flatMap(pathAndQueryReplacer =>
					getDummyUrl(patternSegments, {
						defaultScheme,
						subdomain,
						rootDomain,
						pathAndQueryReplacer,
						strict,
					}),
				),
			),
		),
	)

	return uniq(all.filter(Boolean).map(url => url!.href))
}
