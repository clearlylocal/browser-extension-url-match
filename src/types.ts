export type MatchFn = (url: string | URL) => boolean

type Assertable = {
	/**
	 * Return the valid matcher or throw if invalid
	 *
	 * @throws {TypeError}
	 */
	assertValid: () => Matcher
}

export type Matcher = Readonly<
	Assertable & {
		valid: true
		match: MatchFn
		patterns: string[]
		examples: string[]
		config: MatchPatternOptions
		error?: undefined
	}
>

export type InvalidMatcher = Readonly<
	Assertable & {
		valid: false
		error: Error
	}
>

export type MatcherOrInvalid = Matcher | InvalidMatcher

export type MatchPatternOptions = {
	supportedSchemes?: (
		| 'http'
		| 'https'
		| 'ws'
		| 'wss'
		| 'ftp'
		| 'ftps'
		| 'file'
	)[]
	// | 'data'
	// | 'urn'
	schemeStarMatchesWs?: boolean
	strict?: boolean
}

export type PatternSegments = {
	pattern: string
	scheme: string
	rawHost: string
	rawPathAndQuery: string
}
