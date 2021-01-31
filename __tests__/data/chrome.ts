// https://developer.chrome.com/docs/extensions/mv3/match_patterns/

export const wellFormed = [
	{
		pattern: 'http://*/*',
		accept: ['http://www.google.com/', 'http://example.org/foo/bar.html'],
		reject: [],
	},
	{
		pattern: 'http://*/foo*',
		accept: [
			'http://example.com/foo/bar.html',
			'http://www.google.com/foo',
		],
		reject: [],
	},
	{
		pattern: 'https://*.google.com/foo*bar',
		accept: [
			'https://www.google.com/foo/baz/bar',
			'https://docs.google.com/foobar',
		],
		reject: [],
	},
	{
		pattern: 'http://example.org/foo/bar.html',
		accept: ['http://example.org/foo/bar.html'],
		reject: [],
	},
	{
		pattern: 'file:///foo*',
		accept: ['file:///foo/bar.html', 'file:///foo'],
		reject: [],
	},
	{
		pattern: 'http://127.0.0.1/*',
		accept: ['http://127.0.0.1/', 'http://127.0.0.1/foo/bar.html'],
		reject: [],
	},
	{
		pattern: '*://mail.google.com/*',
		accept: [
			'http://mail.google.com/foo/baz/bar',
			'https://mail.google.com/foobar',
		],
		reject: [],
	},
	{
		pattern: '<all_urls>',
		accept: ['http://example.org/foo/bar.html', 'file:///bar/baz.html'],
		reject: [],
	},
]

export const badlyFormed = [
	'http://www.google.com',
	'http://*foo/bar',
	'http://foo.*.bar/baz',
	'http:/bar',
	'foo://*',
]
