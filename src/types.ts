export type MatchFn = (url: string | URL) => boolean

export type Matcher = {
	match: MatchFn
	valid: boolean
	error?: Error
}

export type MatchPatternOptions = {
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
	strict?: boolean
}

export type PatternData = {
	pattern: string
	scheme: string
	rawHost: string
	rawPathAndQuery: string
}
