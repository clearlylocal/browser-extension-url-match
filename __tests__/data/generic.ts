export const wellFormed = [
	// https://github.com/nickclaw/url-match-patterns/issues/2
	{
		pattern: 'https://*.ft.com/lol',
		accept: [
			'https://a.ft.com/lol',
			'https://a.b.c.ft.com/lol',
			'https://ft.com/lol',
		],
		reject: [
			'https://www.microsoft.com/lol',
			'https://a.microsoft.com/lol',
		],
	},
	{
		pattern: '*://google.com/?',
		accept: ['https://google.com/?'],
		reject: ['https://google.com/a?', 'https://google.com/?a=1'],
	},
]

export const malformed = [
	'',
	'*:/www.ab.com/',
	'htp://www.ab.com/',
	'https://www.ab.com',
	'https://www.a[]b.com/',
	'https://www.a()b.com/',
	'https://www.a\0b.com/',
	'https://*.*.www.ab.com/',
	'https://www.*.ab.com/',
	'https://*www.ab.com/',

	// https://github.com/clearlylocal/browser-extension-url-match/issues/3
	'https://example.com#',
	'https://example.com/#',
	'https://example.com/#foo',
	'https://example.com#bar',

	'https://example.com#/foo',
	'https://example.com/#/bar',
]
