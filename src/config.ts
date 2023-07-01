import { MatchPatternOptions } from './types'

export const presets: Record<
	'chrome' | 'firefox',
	Pick<
		Required<MatchPatternOptions>,
		'supportedSchemes' | 'schemeStarMatchesWs'
	>
> = {
	chrome: {
		supportedSchemes: [
			'http',
			'https',
			'file',
			'ftp',
			// 'urn',
		],
		schemeStarMatchesWs: false,
	},
	firefox: {
		supportedSchemes: [
			'http',
			'https',
			'ws',
			'wss',
			'ftp',
			'file',
			// 'ftps',
			// 'data',
		],
		schemeStarMatchesWs: true,
	},
}

export const defaultOptions: Required<MatchPatternOptions> = {
	...presets.chrome,
	strict: true,
}
