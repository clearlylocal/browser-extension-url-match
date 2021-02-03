import { regex, regexEscape } from 'fancy-regex'
import { getDummyUrl } from './getDummyUrl'
import { PatternSegments } from './types'

export const getHostRegex = (patternSegments: PatternSegments) => {
	const { pattern, scheme, rawHost } = patternSegments

	if (!rawHost && scheme !== 'file') {
		return new Error('Host is optional only if the scheme is "file".')
	}

	const isStarHost = rawHost.includes('*')

	if (isStarHost) {
		const segments = rawHost.split('*.')

		if (
			rawHost.length > 1 &&
			(segments.length !== 2 || segments[0] || !segments[1])
		) {
			return new Error(
				'Host can contain only one wildcard at the start, in the form "*.<host segments>"',
			)
		}
	}

	const dummyUrl = getDummyUrl(patternSegments, {
		subdomain: '',
	})

	if (!dummyUrl) {
		return new Error(
			`Pattern "${pattern}" cannot be used to construct a valid URL.`,
		)
	}

	const dummyHost = dummyUrl.host

	if (/:\d+$/.test(dummyHost)) {
		return new Error(
			`Host "${rawHost}" cannot include a port number. All ports are matched by default.`,
		)
	}

	if (/[^.a-z0-9\-]/.test(dummyHost)) {
		return new Error(`Host "${rawHost}" contains invalid characters.`)
	}

	const host = isStarHost ? '*.' + dummyHost : dummyHost

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
