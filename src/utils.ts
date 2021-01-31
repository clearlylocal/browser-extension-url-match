import { Matcher } from './types'

export const normalizeUrlFragment = (urlFragent: string) =>
	encodeURI(decodeURI(urlFragent))

export const createMatcher = (fn: (url: URL) => boolean): Matcher => (
	url: string | URL,
) => {
	let normalizedUrl: URL

	try {
		const urlStr = url instanceof URL ? url.href : url

		normalizedUrl = new URL(urlStr)

		normalizedUrl.pathname = normalizeUrlFragment(normalizedUrl.pathname)
		normalizedUrl.search = normalizeUrlFragment(normalizedUrl.search)
	} catch (_e) {
		return false
	}

	return fn(normalizedUrl)
}
