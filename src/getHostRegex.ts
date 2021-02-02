import { regex, regexEscape } from 'fancy-regex'
import { WWW } from './constants'
import { getDummyUrl } from './getDummyUrl'
import { PatternSegments } from './types'

export const getHostRegex = (patternSegments: PatternSegments) => {
	const { pattern, scheme, rawHost } = patternSegments

	const isStarHost = rawHost.includes('*')

	if (isStarHost) {
		const segments = rawHost.split('*.')

		if (
			rawHost.length > 1 &&
			(segments.length !== 2 || segments[0] || !segments[1])
		) {
			return new Error(
				'partial-wildcard host must be of form *.<host segments>',
			)
		}
	}

	const dummyUrl = getDummyUrl(patternSegments, {
		subdomain: WWW,
	})

	if (!dummyUrl) {
		return new Error(
			`pattern ${pattern} cannot be used to construct a valid URL`,
		)
	}

	const dummyHost = dummyUrl.host

	if (/[^.a-z0-9\-]/.test(dummyHost)) {
		return new Error(`host ${rawHost} contains invalid characters`)
	}

	const host = isStarHost ? dummyHost.replace(regex`^${WWW}`, '*') : dummyHost

	if (!host && scheme !== 'file') {
		return new Error('host is optional only if the scheme is "file".')
	}

	if (rawHost === '*') {
		return /.+/
	} else if (host.startsWith('*.')) {
		return regex`
			^
				(?:[^.]+\.)*     # any number of dot-terminated segments
				${regexEscape(host.slice(2))}   # rest after leading *.
			$
		`
	} else {
		return regex`^${regexEscape(host)}$`
	}
}
