import { matchPattern, matchPatternWithConfig, presets } from '../src'

describe('config', () => {
	describe('defaults', () => {
		it('onInvalid = null', () => {
			expect(matchPattern('INVALID')).toBe(null)
		})

		it('schemeStarMatchesWs = false', () => {
			expect(matchPattern('*://a.com/')!('http://a.com')).toBe(true)
			expect(matchPattern('*://a.com/')!('ws://a.com')).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(matchPattern('<all_urls>')!('http://a.com')).toBe(true)
			expect(matchPattern('<all_urls>')!('ws://a.com')).toBe(false)

			expect(matchPattern('https://example.com/')).toBeTruthy()
			expect(matchPattern('wss://example.com/')).toBeFalsy()
		})

		it('strict = true', () => {
			expect(matchPattern('https://a.com/b')!('https://a.com')).toBe(
				false,
			)
		})
	})

	describe('defaults with empty config', () => {
		const matchPattern = matchPatternWithConfig({})

		it('onInvalid = null', () => {
			expect(matchPattern('INVALID')).toBe(null)
		})

		it('schemeStarMatchesWs = false', () => {
			expect(matchPattern('*://a.com/')!('http://a.com')).toBe(true)
			expect(matchPattern('*://a.com/')!('ws://a.com')).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(matchPattern('<all_urls>')!('http://a.com')).toBe(true)
			expect(matchPattern('<all_urls>')!('ws://a.com')).toBe(false)

			expect(matchPattern('https://example.com/')).toBeTruthy()
			expect(matchPattern('wss://example.com/')).toBeFalsy()
		})

		it('strict = true', () => {
			expect(matchPattern('https://a.com/b')!('https://a.com')).toBe(
				false,
			)
		})
	})

	describe('firefox defaults', () => {
		const matchPattern = matchPatternWithConfig(presets.firefox)

		it('schemeStarMatchesWs = true', () => {
			expect(matchPattern('*://a.com/')!('http://a.com')).toBe(true)
			expect(matchPattern('*://a.com/')!('ws://a.com')).toBe(true)
		})

		it('supportedSchemes = firefox defaults', () => {
			expect(matchPattern('<all_urls>')!('http://a.com')).toBe(true)
			expect(matchPattern('<all_urls>')!('ws://a.com')).toBe(true)

			expect(matchPattern('https://example.com/')).toBeTruthy()
			expect(matchPattern('wss://example.com/')).toBeTruthy()
		})
	})

	describe('chrome defaults', () => {
		const matchPattern = matchPatternWithConfig(presets.chrome)

		it('schemeStarMatchesWs = false', () => {
			expect(matchPattern('*://a.com/')!('http://a.com')).toBe(true)
			expect(matchPattern('*://a.com/')!('ws://a.com')).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(matchPattern('<all_urls>')!('http://a.com')).toBe(true)
			expect(matchPattern('<all_urls>')!('ws://a.com')).toBe(false)

			expect(matchPattern('https://example.com/')).toBeTruthy()
			expect(matchPattern('wss://example.com/')).toBeFalsy()
		})
	})

	describe('strict mode', () => {
		it('strict = false', () => {
			const matchPattern = matchPatternWithConfig({
				strict: false,
			})

			const matchUrl = matchPattern('https://a.com/b')!

			expect(matchUrl('https://a.com/b')).toBe(true)

			expect(matchUrl('https://a.com')).toBe(true)
			expect(matchUrl('https://a.com/c')).toBe(true)
			expect(matchUrl('https://a.com/c/d/e/f')).toBe(true)
			expect(matchUrl('https://a.com/b/c/d/e/f')).toBe(true)
		})

		it('strict = true', () => {
			const matchPattern = matchPatternWithConfig({
				strict: true,
			})

			const matchUrl = matchPattern('https://a.com/b')!

			expect(matchUrl('https://a.com/b')).toBe(true)

			expect(matchUrl('https://a.com')).toBe(false)
			expect(matchUrl('https://a.com/c')).toBe(false)
			expect(matchUrl('https://a.com/c/d/e/f')).toBe(false)
			expect(matchUrl('https://a.com/b/c/d/e/f')).toBe(false)
		})
	})

	describe('onInvalid', () => {
		it('onInvalid = null', () => {
			const matchPattern = matchPatternWithConfig({
				onInvalid: 'null',
			})

			expect(matchPattern('')).toBe(null)
		})

		it('onInvalid = throw', () => {
			const matchPattern = matchPatternWithConfig({
				onInvalid: 'throw',
			})

			expect(() => matchPattern('')).toThrow()
		})

		it('onInvalid = debug', () => {
			const matchPattern = matchPatternWithConfig({
				onInvalid: 'debug',
			})

			expect(matchPattern('')).toBeInstanceOf(Error)
		})

		it('onInvalid = alwaysFalse', () => {
			const matchPattern = matchPatternWithConfig({
				onInvalid: 'alwaysFalse',
			})

			expect(matchPattern('')('')).toBe(false)

			expect(
				matchPattern('https://example.com/')('https://example.com/'),
			).toBe(true)

			expect(matchPattern('INVALID')('https://example.com/foo/bar')).toBe(
				false,
			)
		})
	})
})
