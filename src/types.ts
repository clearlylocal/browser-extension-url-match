export type MatchFn = (url: string | URL) => boolean

export type Matcher = {
	examples: string[]
	match: MatchFn
	pattern: string
	config: MatchPatternOptions
} & (
	| {
			valid: true
			error?: undefined
	  }
	| {
			valid: false
			error: Error
	  }
)

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

export type PatternSegments = {
	pattern: string
	scheme: string
	rawHost: string
	rawPathAndQuery: string
}
