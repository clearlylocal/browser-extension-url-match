import { defaultOptions } from './config'
import { getExampleUrls } from './getExampleUrls'
import { toMatchFnOrError } from './toMatcherOrError'
import { MatchPatternOptions, MatchFn, Matcher } from './types'

export const matchPatternWithConfig = (options: MatchPatternOptions) => (
	pattern: string,
): Matcher => {
	const combinedOptions = {
		...defaultOptions,
		...options,
	}

	const val = toMatchFnOrError(pattern, combinedOptions)

	return val instanceof Error
		? {
				valid: false,
				error: val,
				match: (() => false) as MatchFn,
				get examples() {
					return []
				},
				pattern,
				config: combinedOptions,
		  }
		: {
				valid: true,
				match: val,
				get examples() {
					return (
						getExampleUrls(pattern, combinedOptions)
							// sanity check - examples should all match
							.filter(url => (val as MatchFn)(url))
							// prevent example list from getting too long
							.slice(0, 100)
					)
				},
				pattern,
				config: combinedOptions,
		  }
}

export const matchPattern = matchPatternWithConfig({})
