import { matchPattern, presets } from '../src'
import * as chrome from './data/chrome'
import * as firefox from './data/firefox'
import * as generic from './data/generic'
import * as urlMatchPatternsCompat from './data/url-match-patterns-compat'
import * as normalization from './data/normalization'
import { assertInvalid } from './utils/testUtils'

type WellFormed = {
	pattern: string
	accept: string[]
	reject: string[]
}

const tests: Record<
	string,
	{
		wellFormed: WellFormed[]
		malformed: string[]
	}
> = {
	chrome,
	firefox,
	generic,
	urlMatchPatternsCompat,
	normalization,
}

for (const [k, v] of Object.entries(tests)) {
	describe(k, () => {
		const preset = presets[k as keyof typeof presets] ?? presets.chrome

		describe('well-formed', () => {
			for (const { pattern, accept, reject } of v.wellFormed) {
				describe(pattern, () => {
					const matcher = matchPattern(pattern, preset).assertValid()

					it('is valid', () => {
						expect(matcher.valid).toBe(true)

						expect((matcher as any).error).toBeUndefined()
					})

					it('unwraps successfully', () => {
						expect(() => matcher.assertValid()).not.toThrow()
					})

					it('has no error', () => {
						expect((matcher as any).error).toBeUndefined()
					})

					it('has at least 1 example', () => {
						expect(matcher.examples.length).toBeGreaterThanOrEqual(
							1,
						)
					})

					accept.forEach((x) => {
						it(`matches ${x}`, () => {
							expect(matcher.match(x)).toBe(true)
						})
					})

					reject.forEach((x) => {
						it(`doesn't match ${x}`, () => {
							expect(matcher.match(x)).toBe(false)
						})
					})
				})
			}
		})

		describe('malformed', () => {
			for (const pattern of v.malformed) {
				describe(pattern, () => {
					const matcher = matchPattern(pattern, preset)

					assertInvalid(matcher)

					it('is invalid', () => {
						expect(matcher.valid).toBe(false)
					})

					it('throws on assertValid', () => {
						expect(() => matcher.assertValid()).toThrow(TypeError)
					})

					it('has error', () => {
						expect(matcher.error).toBeInstanceOf(TypeError)
					})

					it('has no `match` method', () => {
						expect((matcher as any).match).toBeUndefined()
					})

					it('has no examples', () => {
						expect((matcher as any).examples).toBeUndefined()
					})
				})
			}
		})
	})
}
