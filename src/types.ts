export type Matcher = (url: string | URL) => boolean

export type MatcherPatternOptions = {
	supportedSchemes?: (
		| 'http'
		| 'https'
		| 'ws'
		| 'wss'
		| 'ftp'
		| 'ftps'
		| 'data'
		| 'file'
	)[]
	schemeStarMatchesWs?: boolean
	onInvalid?: 'throw' | 'null' | 'debug' | 'alwaysFalse'
	strict?: boolean
}
