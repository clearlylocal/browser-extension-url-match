import { matchPattern } from '../src'
import { assertInvalid } from './utils/testUtils'

describe('matchAny', () => {
	it('valid', () => {
		const pattern1 = 'https://example.com/foo/*'
		const pattern2 = 'https://example.com/foo2/*'

		let matcher = matchPattern([pattern1, pattern2])

		expect(() => matcher.assertValid()).not.toThrow()

		matcher = matcher.assertValid()

		expect(matcher.match('https://example.com/foo/bar')).toBe(true)
		expect(matcher.match('https://example.com/foo2/bar')).toBe(true)
		expect(matcher.match('https://example.com/bar/baz')).toBe(false)

		expect(matcher.examples.length).toBeGreaterThanOrEqual(2)

		expect(matcher.examples.length).toBe(
			matchPattern(pattern1).assertValid().examples.length +
				matchPattern(pattern2).assertValid().examples.length,
		)

		expect(matcher.patterns).toStrictEqual([pattern1, pattern2])
	})

	it('invalid', () => {
		const matcher = matchPattern([
			'https://invalid-pattern.com',
			'https://example.com/foo/*',
			'https://example.com/foo2/*',
		])

		assertInvalid(matcher)

		expect(() => matcher.assertValid()).toThrow(TypeError)
		expect(() => matcher.assertValid()).toThrow(
			'Pattern "https://invalid-pattern.com" does not contain a path',
		)

		expect(matcher.valid).toBe(false)
		expect(matcher.error).toBeInstanceOf(TypeError)
	})
})
