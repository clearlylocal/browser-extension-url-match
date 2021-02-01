import { MatchPatternOptions } from './types'

export const presets: Record<
	'chrome' | 'firefox',
	Pick<
		Required<MatchPatternOptions>,
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

export const defaultOptions: Required<MatchPatternOptions> = {
	...presets.chrome,
	strict: true,
}
