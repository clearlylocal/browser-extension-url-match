import { PatternSegments } from './types'

type DummyUrlOptions = Partial<{
	strict: boolean
	defaultScheme: string
	subdomain: string
	pathAndQueryReplacer: string
	rootDomain: string
}>

export const getDummyUrl = (
	patternSegments: PatternSegments,
	replacements: DummyUrlOptions = {},
) => {
	const { rawHost, rawPathAndQuery } = patternSegments
	const {
		defaultScheme = 'https',
		subdomain = '',
		pathAndQueryReplacer = '',
		rootDomain = 'example.com',
		strict = true,
	} = replacements

	let host

	const scheme =
		patternSegments.scheme === '*' ? defaultScheme : patternSegments.scheme

	if (scheme === 'file') {
		host = ''
	} else if (rawHost === '*') {
		host = [subdomain, rootDomain].filter(Boolean).join('.')
	} else {
		host = rawHost.replace(/^\*./, subdomain ? `${subdomain}.` : '')
	}

	try {
		return new URL(
			`${scheme}://${host}${(strict ? rawPathAndQuery : '/*')
				.replace(/\*/g, pathAndQueryReplacer)
				.replace(/\/+/g, '/')}`,
		)
	} catch (_e) {
		return null
	}
}
