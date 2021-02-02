import { matchPatternWithConfig, presets } from '../src'
import * as chrome from './data/chrome'
import * as firefox from './data/firefox'
import * as generic from './data/generic'
import * as urlMatchPatternsCompat from './data/url-match-patterns-compat'
import * as normalization from './data/normalization'

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

Object.entries(tests).forEach(([k, v]) => {
	describe(k, () => {
		const preset = presets[k as keyof typeof presets] ?? presets.chrome

		const matchPattern = matchPatternWithConfig(preset)

		describe('well-formed', () => {
			v.wellFormed.forEach(({ pattern, accept, reject }) => {
				describe(pattern, () => {
					const matcher = matchPattern(pattern)

					it('is valid', () => {
						expect(matcher.valid).toBe(true)

						expect(matcher.error).toBeUndefined()
					})

					it('has at least 1 example', () => {
						expect(matcher.examples.length).toBeGreaterThanOrEqual(
							1,
						)
					})

					accept.forEach(x => {
						it(`matches ${x}`, () => {
							expect(matcher.match(x)).toBe(true)
						})
					})

					reject.forEach(x => {
						it(`doesn't match ${x}`, () => {
							expect(matcher.match(x)).toBe(false)
						})
					})
				})
			})
		})

		describe('malformed', () => {
			const allAccept = v.wellFormed.flatMap(({ accept }) => accept)

			v.malformed.forEach(pattern => {
				describe(pattern, () => {
					const matcher = matchPattern(pattern)

					it('is invalid', () => {
						expect(matcher.valid).toBe(false)
					})

					it('has error', () => {
						expect(matcher.error).toBeInstanceOf(Error)
					})

					it('never matches', () => {
						expect(allAccept.some(str => matcher.match(str))).toBe(
							false,
						)
					})

					it('has no examples', () => {
						expect(matcher.examples.length).toBe(0)
					})
				})
			})
		})
	})
})
