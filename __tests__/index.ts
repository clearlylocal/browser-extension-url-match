import { matchPatternWithConfig, presets } from '../src'
import * as chrome from './data/chrome'
import * as firefox from './data/firefox'
import * as generic from './data/generic'
import * as urlMatchPatternsCompat from './data/url-match-patterns-compat'
import * as normalization from './data/normalization'

const all = {
	chrome,
	firefox,
	generic,
	urlMatchPatternsCompat,
	normalization,
}

Object.entries(all).forEach(([k, v]) => {
	describe(k, () => {
		const preset = presets[k as keyof typeof presets] || presets.chrome

		describe('well formed', () => {
			v.wellFormed.forEach(({ pattern, accept, reject }) => {
				const matchPattern = matchPatternWithConfig({
					...preset,
					onInvalid: 'throw',
				})

				describe(pattern, () => {
					const matchUrl = matchPattern(pattern)

					accept.forEach(x => {
						it(`matches ${x}`, () => {
							expect(matchUrl(x)).toBe(true)
						})
					})

					reject.forEach(x => {
						it(`doesn't match ${x}`, () => {
							expect(matchUrl(x)).toBe(false)
						})
					})
				})
			})
		})

		describe('badly formed', () => {
			v.badlyFormed.forEach(pattern => {
				const matchPattern = matchPatternWithConfig({
					...preset,
					onInvalid: 'throw',
				})

				it(pattern, () => {
					expect(() => matchPattern(pattern)).toThrow()
				})
			})
		})
	})
})
