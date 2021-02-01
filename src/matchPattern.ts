import { defaultOptions } from './config'
import { toMatcherOrError } from './toMatcherOrError'
import { MatchPatternOptions, MatchFn, Matcher } from './types'

export const matchPatternWithConfig = (options: MatchPatternOptions) => (
	pattern: string,
): Matcher => {
	const val = toMatcherOrError(pattern, {
		...defaultOptions,
		...options,
	})

	return val instanceof Error
		? {
				match: (() => false) as MatchFn,
				valid: false,
				error: val,
		  }
		: {
				match: val,
				valid: true,
		  }
}

export const matchPattern = matchPatternWithConfig({})
