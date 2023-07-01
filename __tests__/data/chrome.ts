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
		pattern: 'http://localhost/*',
		accept: [
			'http://localhost/',
			'http://localhost:8080/',
			'http://localhost/xyz',
			'http://localhost:8080/xyz',
		],
		reject: [],
	},
	{
		pattern: 'https://localhost/a/b/c',
		accept: [
			'https://localhost/a/b/c',
			'https://localhost:8080/a/b/c',
			'https://localhost/a/b/c',
			'https://localhost:8080/a/b/c',
		],
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

export const malformed = [
	'http://www.google.com',
	'http://*foo/bar',
	'http://foo.*.bar/baz',
	'http:/bar',
	'foo://*',
	// chrome doesn't support `data:` scheme
	'data:text/html;base64,PGh0bWw+',
	// chrome supports `urn:` scheme, but library intentionally rejects due to unclear syntax/semantics in the spec
	'urn:uuid:54723bea-c94e-480e-80c8-a69846c3f582',
]
