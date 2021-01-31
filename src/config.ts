import { MatcherPatternOptions } from './types'

export const presets: Record<
	'chrome' | 'firefox',
	Pick<
		Required<MatcherPatternOptions>,
		'supportedSchemes' | 'schemeStarMatchesWs'
	>
> = {
	chrome: {
		supportedSchemes: ['http', 'https', 'file', 'ftp'],
		schemeStarMatchesWs: false,
	},
	firefox: {
		supportedSchemes: [
			'http',
			'https',
			'ws',
			'wss',
			'ftp',
			'ftps',
			'data',
			'file',
		],
		schemeStarMatchesWs: true,
	},
}

export const defaultOptions: Required<MatcherPatternOptions> = {
	...presets.chrome,
	onInvalid: 'null',
	strict: true,
}
