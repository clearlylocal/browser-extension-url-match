import { matchPattern, presets } from '../src'

describe('config', () => {
	describe('defaults', () => {
		it('schemeStarMatchesWs = false', () => {
			expect(
				matchPattern('*://a.com/').assertValid().match('http://a.com'),
			).toBe(true)
			expect(
				matchPattern('*://a.com/').assertValid().match('ws://a.com'),
			).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(
				matchPattern('<all_urls>').assertValid().match('http://a.com'),
			).toBe(true)
			expect(
				matchPattern('<all_urls>').assertValid().match('ws://a.com'),
			).toBe(false)

			expect(matchPattern('https://example.com/').valid).toBe(true)
			expect(matchPattern('wss://example.com/').valid).toBe(false)
		})

		it('strict = true', () => {
			expect(
				matchPattern('https://a.com/b')
					.assertValid()
					.match('https://a.com'),
			).toBe(false)
		})
	})

	describe('defaults (explicitly supply empty options object)', () => {
		it('schemeStarMatchesWs = false', () => {
			expect(
				matchPattern('*://a.com/', {})
					.assertValid()
					.match('http://a.com'),
			).toBe(true)
			expect(
				matchPattern('*://a.com/', {})
					.assertValid()
					.match('ws://a.com'),
			).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(
				matchPattern('<all_urls>', {})
					.assertValid()
					.match('http://a.com'),
			).toBe(true)
			expect(
				matchPattern('<all_urls>', {})
					.assertValid()
					.match('ws://a.com'),
			).toBe(false)

			expect(matchPattern('https://example.com/', {}).valid).toBe(true)
			expect(matchPattern('wss://example.com/', {}).valid).toBe(false)
		})

		it('strict = true', () => {
			expect(
				matchPattern('https://a.com/b', {})
					.assertValid()
					.match('https://a.com'),
			).toBe(false)
		})
	})

	describe('firefox defaults', () => {
		it('schemeStarMatchesWs = true', () => {
			expect(
				matchPattern('*://a.com/', presets.firefox)
					.assertValid()
					.match('http://a.com'),
			).toBe(true)
			expect(
				matchPattern('*://a.com/', presets.firefox)
					.assertValid()
					.match('ws://a.com'),
			).toBe(true)
		})

		it('supportedSchemes = firefox defaults', () => {
			expect(
				matchPattern('<all_urls>', presets.firefox)
					.assertValid()
					.match('http://a.com'),
			).toBe(true)
			expect(
				matchPattern('<all_urls>', presets.firefox)
					.assertValid()
					.match('ws://a.com'),
			).toBe(true)

			expect(
				matchPattern('https://example.com/', presets.firefox).valid,
			).toBe(true)
			expect(
				matchPattern('wss://example.com/', presets.firefox).valid,
			).toBe(true)
		})
	})

	describe('chrome defaults', () => {
		it('schemeStarMatchesWs = false', () => {
			expect(
				matchPattern('*://a.com/', presets.chrome)
					.assertValid()
					.match('http://a.com'),
			).toBe(true)
			expect(
				matchPattern('*://a.com/', presets.chrome)
					.assertValid()
					.match('ws://a.com'),
			).toBe(false)
		})

		it('supportedSchemes = chrome defaults', () => {
			expect(
				matchPattern('<all_urls>', presets.chrome)
					.assertValid()
					.match('http://a.com'),
			).toBe(true)
			expect(
				matchPattern('<all_urls>', presets.chrome)
					.assertValid()
					.match('ws://a.com'),
			).toBe(false)

			expect(
				matchPattern('https://example.com/', presets.chrome).valid,
			).toBe(true)
			expect(
				matchPattern('wss://example.czom/', presets.chrome).valid,
			).toBe(false)
		})
	})

	describe('strict mode', () => {
		it('strict = false', () => {
			const matcher = matchPattern('https://a.com/b', { strict: false })

			expect(matcher.assertValid().match('https://a.com/b')).toBe(true)

			expect(matcher.assertValid().match('https://a.com')).toBe(true)
			expect(matcher.assertValid().match('https://a.com/c')).toBe(true)
			expect(matcher.assertValid().match('https://a.com/c/d/e/f')).toBe(
				true,
			)
			expect(matcher.assertValid().match('https://a.com/b/c/d/e/f')).toBe(
				true,
			)
		})

		it('strict = true', () => {
			const matcher = matchPattern('https://a.com/b', { strict: true })

			expect(matcher.assertValid().match('https://a.com/b')).toBe(true)

			expect(matcher.assertValid().match('https://a.com')).toBe(false)
			expect(matcher.assertValid().match('https://a.com/c')).toBe(false)
			expect(matcher.assertValid().match('https://a.com/c/d/e/f')).toBe(
				false,
			)
			expect(matcher.assertValid().match('https://a.com/b/c/d/e/f')).toBe(
				false,
			)
		})
	})
})
