import { matchPattern, presets } from '../src'

describe('error messages', () => {
	it('invalid pattern (bare URL origin with no trailing slash)', () => {
		expect(matchPattern('https://example.com').error?.message).toMatch(
			'Pattern "https://example.com" lacks a trailing slash',
		)
	})

	it('generic invalid pattern', () => {
		expect(matchPattern('_').error?.message).toMatch(
			'Pattern "_" is invalid',
		)
	})

	it('invalid pattern one of many', () => {
		expect(
			matchPattern(['https://example.com/foo/*', 'https://example.com'])
				.error?.message,
		).toMatch('Pattern "https://example.com" lacks a trailing slash')
	})

	it('unsupported scheme', () => {
		expect(matchPattern('htp://example.com/*').error?.message).toMatch(
			'Scheme "htp" is not supported',
		)
	})

	it('urn:', () => {
		expect(matchPattern('urn:abc').error?.message).toMatch(
			'not currently support',
		)
	})

	it('data: (FF)', () => {
		expect(
			matchPattern('data:abc', presets.firefox).error?.message,
		).toMatch('not currently support')
	})

	it('cannot be used to construct a valid URL', () => {
		expect(matchPattern('http://\0/*').error?.message).toMatch(
			'cannot be used to construct a valid URL',
		)
	})

	it('contains port number', () => {
		expect(matchPattern('*://a.com:8080/').error?.message).toMatch(
			'port number',
		)
	})

	it('invalid characters', () => {
		expect(matchPattern('*://a_b.co/').error?.message).toMatch(
			'Host "a_b.co" contains invalid characters',
		)
	})

	it('malformed partial-wildcard host', () => {
		expect(matchPattern('*://*.*.a.co/').error?.message).toMatch(
			'can contain only one wildcard at the start',
		)

		expect(matchPattern('*://a.*.b.co/').error?.message).toMatch(
			'can contain only one wildcard at the start',
		)
	})

	it('missing host', () => {
		expect(matchPattern('*:///a').error?.message).toMatch(
			'Host is optional only if the scheme is "file"',
		)

		expect(matchPattern('http:///a').error?.message).toMatch(
			'Host is optional only if the scheme is "file"',
		)

		expect(matchPattern('file:///a').error).toBeUndefined()
	})
})
