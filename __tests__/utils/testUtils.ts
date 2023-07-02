import { InvalidMatcher, MatcherOrInvalid } from '../../src/types'

export function assertInvalid(
	matcher: MatcherOrInvalid,
): asserts matcher is InvalidMatcher {
	if (matcher.valid) {
		throw new TypeError('Expected malformed to be invalid')
	}
}
