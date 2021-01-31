import { defaultOptions } from './config'
import { toMatcherOrError } from './toMatcherOrError'
import { MatcherPatternOptions, Matcher } from './types'

export const matchPatternWithConfig = <TOptions extends MatcherPatternOptions>(
	options: TOptions,
) => (
	pattern: string,
):
	| Matcher
	| (TOptions extends { onInvalid: 'throw' }
			? never
			: TOptions extends { onInvalid: 'debug' }
			? Error
			: TOptions extends { onInvalid: 'alwaysFalse' }
			? Matcher
			: null) => {
	const combinedOptions = {
		...defaultOptions,
		...options,
	}

	const val = toMatcherOrError(combinedOptions)(pattern)

	const { onInvalid } = combinedOptions

	switch (onInvalid) {
		case 'debug':
			return val as any
		case 'alwaysFalse':
			return val instanceof Error ? ((() => false) as Matcher) : val
		case 'throw':
			if (val instanceof Error) throw val

			return val
		default:
			return val instanceof Error ? null : (val as any)
	}
}
