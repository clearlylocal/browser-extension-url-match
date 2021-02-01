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

const all: Record<
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

Object.entries(all).forEach(([k, v]) => {
	describe(k, () => {
		const preset = presets[k as keyof typeof presets] ?? presets.chrome

		const matchPattern = matchPatternWithConfig(preset)

		describe('well-formed', () => {
			v.wellFormed.forEach(({ pattern, accept, reject }) => {
				describe(pattern, () => {
					const matcher = matchPattern(pattern)

					it('is valid', () => {
						expect(matchPattern(pattern).valid).toBe(true)

						expect(matchPattern(pattern).error).toBeUndefined()
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
				it(pattern, () => {
					const m = matchPattern(pattern)

					expect(m.valid).toBe(false)
					expect(m.error).toBeInstanceOf(Error)

					expect(allAccept.some(str => m.match(str))).toBe(false)
				})
			})
		})
	})
})
