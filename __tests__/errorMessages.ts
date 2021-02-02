import { matchPattern } from '../src'

describe('error messages', () => {
	it('contains port number', () => {
		expect(matchPattern('*://a.com:8080/').error?.message).toMatch(
			/port number/i,
		)
	})

	it('invalid characters', () => {
		expect(matchPattern('*://a_b.co/').error?.message).toMatch(
			/contains invalid characters/i,
		)
	})

	it('malformed partial-wildcard host', () => {
		expect(matchPattern('*://*.*.a.co/').error?.message).toMatch(
			/Partial-wildcard host/i,
		)

		expect(matchPattern('*://a.*.b.co/').error?.message).toMatch(
			/Partial-wildcard host/i,
		)
	})

	it('missing host', () => {
		expect(matchPattern('*:///a').error?.message).toMatch(
			/Host is optional only if the scheme is "file"/i,
		)

		expect(matchPattern('http:///a').error?.message).toMatch(
			/Host is optional only if the scheme is "file"/i,
		)
	})
})
