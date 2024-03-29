import { regex } from 'fancy-regex'
import { PatternSegments } from './types'

type DummyUrlOptions = Partial<{
	strict: boolean
	defaultScheme: string
	subdomain: string
	pathAndQueryReplacer: string
	rootDomain: string
}>

const DELIMS = /^|$|[/?=&\-]/

export function getDummyUrl(
	patternSegments: PatternSegments,
	replacements: DummyUrlOptions = {},
) {
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

	const pathAndQuery = (strict ? rawPathAndQuery : '/*')
		// start with hyphen-delimited
		.replace(/\*/g, `-${pathAndQueryReplacer}-`)
		// remove consecutive hyphens and hyphens adjacent to delimiters
		.replace(regex('g')`-+(${DELIMS})`, '$1')
		.replace(regex('g')`(${DELIMS})-+`, '$1')
		// remove consecutive slashes
		.replace(/\/+/g, '/')

	try {
		return new URL(`${scheme}://${host}${pathAndQuery}`)
	} catch (_e) {
		return null
	}
}
