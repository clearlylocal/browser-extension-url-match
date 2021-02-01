import { matchPattern, matchPatternWithConfig, presets } from '../src'

describe('config', () => {
	describe('defaults', () => {
		it('schemeStarMatchesWs = false', () => {
			expect(matchPattern('*://a.com/').match('http://a.com')).toBe(true)
			expect(matchPattern('*://a.com/').match('ws://a.com')).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(matchPattern('<all_urls>').match('http://a.com')).toBe(true)
			expect(matchPattern('<all_urls>').match('ws://a.com')).toBe(false)

			expect(matchPattern('https://example.com/').valid).toBe(true)
			expect(matchPattern('wss://example.com/').valid).toBe(false)
		})

		it('strict = true', () => {
			expect(matchPattern('https://a.com/b').match('https://a.com')).toBe(
				false,
			)
		})
	})

	describe('defaults with empty config', () => {
		const matchPattern = matchPatternWithConfig({})

		it('schemeStarMatchesWs = false', () => {
			expect(matchPattern('*://a.com/').match('http://a.com')).toBe(true)
			expect(matchPattern('*://a.com/').match('ws://a.com')).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(matchPattern('<all_urls>').match('http://a.com')).toBe(true)
			expect(matchPattern('<all_urls>').match('ws://a.com')).toBe(false)

			expect(matchPattern('https://example.com/').valid).toBe(true)
			expect(matchPattern('wss://example.com/').valid).toBe(false)
		})

		it('strict = true', () => {
			expect(matchPattern('https://a.com/b').match('https://a.com')).toBe(
				false,
			)
		})
	})

	describe('firefox defaults', () => {
		const matchPattern = matchPatternWithConfig(presets.firefox)

		it('schemeStarMatchesWs = true', () => {
			expect(matchPattern('*://a.com/').match('http://a.com')).toBe(true)
			expect(matchPattern('*://a.com/').match('ws://a.com')).toBe(true)
		})

		it('supportedSchemes = firefox defaults', () => {
			expect(matchPattern('<all_urls>').match('http://a.com')).toBe(true)
			expect(matchPattern('<all_urls>').match('ws://a.com')).toBe(true)

			expect(matchPattern('https://example.com/').valid).toBe(true)
			expect(matchPattern('wss://example.com/').valid).toBe(true)
		})
	})

	describe('chrome defaults', () => {
		const matchPattern = matchPatternWithConfig(presets.chrome)

		it('schemeStarMatchesWs = false', () => {
			expect(matchPattern('*://a.com/').match('http://a.com')).toBe(true)
			expect(matchPattern('*://a.com/').match('ws://a.com')).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(matchPattern('<all_urls>').match('http://a.com')).toBe(true)
			expect(matchPattern('<all_urls>').match('ws://a.com')).toBe(false)

			expect(matchPattern('https://example.com/').valid).toBe(true)
			expect(matchPattern('wss://example.czom/').valid).toBe(false)
		})
	})

	describe('strict mode', () => {
		it('strict = false', () => {
			const matchPattern = matchPatternWithConfig({
				strict: false,
			})

			const matcher = matchPattern('https://a.com/b')

			expect(matcher.match('https://a.com/b')).toBe(true)

			expect(matcher.match('https://a.com')).toBe(true)
			expect(matcher.match('https://a.com/c')).toBe(true)
			expect(matcher.match('https://a.com/c/d/e/f')).toBe(true)
			expect(matcher.match('https://a.com/b/c/d/e/f')).toBe(true)
		})

		it('strict = true', () => {
			const matchPattern = matchPatternWithConfig({
				strict: true,
			})

			const matcher = matchPattern('https://a.com/b')!

			expect(matcher.match('https://a.com/b')).toBe(true)

			expect(matcher.match('https://a.com')).toBe(false)
			expect(matcher.match('https://a.com/c')).toBe(false)
			expect(matcher.match('https://a.com/c/d/e/f')).toBe(false)
			expect(matcher.match('https://a.com/b/c/d/e/f')).toBe(false)
		})
	})
})
