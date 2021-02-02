import { MatchFn } from './types'

export const uniq = <T extends any>(arr: T[]) => {
	return arr.filter((x, idx) => arr.indexOf(x) === idx)
}

export const normalizeUrlFragment = (urlFragent: string) => {
	try {
		return encodeURI(decodeURI(urlFragent))
	} catch (e) {
		return e as Error
	}
}

export const createMatchFn = (fn: (url: URL) => boolean): MatchFn => (
	url: string | URL,
) => {
	let normalizedUrl: URL

	try {
		const urlStr = url instanceof URL ? url.href : url

		normalizedUrl = new URL(urlStr)

		const normalizedPathname = normalizeUrlFragment(normalizedUrl.pathname)
		const normalizedSearch = normalizeUrlFragment(normalizedUrl.search)

		if (
			normalizedPathname instanceof Error ||
			normalizedSearch instanceof Error
		) {
			return false
		}

		normalizedUrl.pathname = normalizedPathname
		normalizedUrl.search = normalizedSearch
	} catch (_e) {
		return false
	}

	return fn(normalizedUrl)
}
