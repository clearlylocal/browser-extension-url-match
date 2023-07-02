import { defaultOptions } from './config'
import { getExampleUrls } from './getExampleUrls'
import { toMatchFnOrError } from './toMatcherOrError'
import {
	MatchPatternOptions,
	MatchFn,
	MatcherOrInvalid,
	Matcher,
	InvalidMatcher,
} from './types'

function assertValid(this: MatcherOrInvalid): Matcher {
	if (!this.valid) {
		throw new TypeError(this.error.message)
	}

	return this
}

function _matchPattern(options: MatchPatternOptions) {
	return (pattern: string): MatcherOrInvalid => {
		const combinedOptions = {
			...defaultOptions,
			...options,
		}

		const val = toMatchFnOrError(pattern, combinedOptions)

		return val instanceof Error
			? {
					valid: false,
					error: val,
					assertValid,
			  }
			: {
					valid: true,
					match: val,
					get examples() {
						return (
							getExampleUrls(pattern, combinedOptions)
								// sanity check - examples should all match
								.filter((url) => (val as MatchFn)(url))
								// prevent example list from getting too long
								.slice(0, 100)
						)
					},
					patterns: [pattern],
					config: combinedOptions,
					assertValid,
			  }
	}
}

function allValid(
	matchers: readonly MatcherOrInvalid[],
): matchers is readonly Matcher[] {
	return matchers.every((m) => m.valid)
}

export function matchPattern(
	pattern: string[] | string,
	options: Partial<MatchPatternOptions> = {},
): MatcherOrInvalid {
	const patterns =
		typeof pattern === 'string' ? [pattern] : [...new Set(pattern)]

	if (patterns.length === 1) return _matchPattern(options)(patterns[0])

	const matchers: readonly MatcherOrInvalid[] = patterns.map(
		_matchPattern(options),
	)

	if (allValid(matchers)) {
		return {
			valid: true,
			get examples() {
				return [
					...new Set(
						matchers.flatMap((m) => (m as Matcher).examples),
					),
				]
			},
			match: (url: string | URL) => matchers.some((m) => m.match(url)),
			patterns,
			config: options,
			assertValid,
		}
	} else {
		const invalid = matchers.find((m) => !m.valid) as InvalidMatcher

		return {
			valid: false,
			error: invalid.error,
			assertValid,
		}
	}
}
