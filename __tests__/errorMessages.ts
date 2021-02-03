import { matchPattern } from '../src'

describe('error messages', () => {
	it('generic invalid pattern', () => {
		expect(matchPattern('_').error?.message).toMatch(
			/Pattern "_" is invalid/i,
		)
	})

	it('unsupported scheme', () => {
		expect(matchPattern('htp://example.com/*').error?.message).toMatch(
			/Scheme "htp" is not supported/i,
		)
	})

	it('cannot be used to construct a valid URL', () => {
		expect(matchPattern('http://\0/*').error?.message).toMatch(
			/cannot be used to construct a valid URL/i,
		)
	})

	it('contains port number', () => {
		expect(matchPattern('*://a.com:8080/').error?.message).toMatch(
			/port number/i,
		)
	})

	it('invalid characters', () => {
		expect(matchPattern('*://a_b.co/').error?.message).toMatch(
			/Host .+ contains invalid characters/i,
		)
	})

	it('malformed partial-wildcard host', () => {
		expect(matchPattern('*://*.*.a.co/').error?.message).toMatch(
			/can contain only one wildcard at the start/i,
		)

		expect(matchPattern('*://a.*.b.co/').error?.message).toMatch(
			/can contain only one wildcard at the start/i,
		)
	})

	it('missing host', () => {
		expect(matchPattern('*:///a').error?.message).toMatch(
			/Host is optional only if the scheme is "file"/i,
		)

		expect(matchPattern('http:///a').error?.message).toMatch(
			/Host is optional only if the scheme is "file"/i,
		)

		expect(matchPattern('file:///a').error).toBeUndefined()
	})
})
