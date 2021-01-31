// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns

export const wellFormed = [
	{
		pattern: '<all_urls>',
		accept: [
			'http://example.org/',
			'https://a.org/some/path/',
			'ws://sockets.somewhere.org/',
			'wss://ws.example.com/stuff/',
			'ftp://files.somewhere.org/',
			'ftps://files.somewhere.org/',
		],
		reject: ['resource://a/b/c/'],
	},
	{
		pattern: '*://*/*',
		accept: [
			'http://example.org/',
			'https://a.org/some/path/',
			'ws://sockets.somewhere.org/',
			'wss://ws.example.com/stuff/',
		],
		reject: [
			'ftp://ftp.example.org/',
			'ftps://ftp.example.org/',
			'file:///a/',
		],
	},
	{
		pattern: '*://*.mozilla.org/*',
		accept: [
			'http://mozilla.org/',
			'https://mozilla.org/',
			'http://a.mozilla.org/',
			'http://a.b.mozilla.org/',
			'https://b.mozilla.org/path/',
			'ws://ws.mozilla.org/',
			'wss://secure.mozilla.org/something',
		],
		reject: [
			'ftp://mozilla.org/',
			'http://mozilla.com/',
			'http://firefox.org/',
		],
	},
	{
		pattern: '*://mozilla.org/',
		accept: [
			'http://mozilla.org/',
			'https://mozilla.org/',
			'ws://mozilla.org/',
			'wss://mozilla.org/',
		],
		reject: [
			'ftp://mozilla.org/',
			'http://a.mozilla.org/',
			'http://mozilla.org/a',
		],
	},
	{
		pattern: 'ftp://mozilla.org/',
		accept: ['ftp://mozilla.org'],
		reject: [
			'http://mozilla.org/',
			'ftp://sub.mozilla.org/',
			'ftp://mozilla.org/path',
		],
	},
	{
		pattern: 'https://*/path',
		accept: [
			'https://mozilla.org/path',
			'https://a.mozilla.org/path',
			'https://something.com/path',
		],
		reject: [
			'http://mozilla.org/path',
			'https://mozilla.org/path/',
			'https://mozilla.org/a',
			'https://mozilla.org/',
			'https://mozilla.org/path?foo=1',
		],
	},
	{
		pattern: 'https://*/path/',
		accept: ['https://mozilla.org/path/', 'https://a.mozilla.org/path/'],
		reject: [
			'http://mozilla.org/path/',
			'https://mozilla.org/path',
			'https://mozilla.org/a',
			'https://mozilla.org/',
			'https://mozilla.org/path/?foo=1',
			'https://something.com/path',
		],
	},
	{
		pattern: 'https://mozilla.org/*',
		accept: [
			'https://mozilla.org/',
			'https://mozilla.org/path',
			'https://mozilla.org/another',
			'https://mozilla.org/path/to/doc',
			'https://mozilla.org/path/to/doc?foo=1',
		],
		reject: ['http://mozilla.org/path', 'https://mozilla.com/path'],
	},
	{
		pattern: 'https://mozilla.org/a/b/c/',
		accept: [
			'https://mozilla.org/a/b/c/',
			'https://mozilla.org/a/b/c/#section1',
		],
		reject: [],
	},
	{
		pattern: 'https://mozilla.org/*/b/*/',
		accept: [
			'https://mozilla.org/a/b/c/',
			'https://mozilla.org/d/b/f/',
			'https://mozilla.org/a/b/c/d/',
			'https://mozilla.org/a/b/c/d/#section1',
			'https://mozilla.org/a/b/c/d/?foo=/',
			'https://mozilla.org/a?foo=21314&bar=/b/&extra=c/',
		],
		reject: [
			'https://mozilla.org/b/*/',
			'https://mozilla.org/a/b/',
			'https://mozilla.org/a/b/c/d/?foo=bar',
		],
	},
	{
		pattern: 'file:///blah/*',
		accept: ['file:///blah/', 'file:///blah/bleh'],
		reject: ['file:///bleh/'],
	},
]

export const badlyFormed = [
	'resource://path/', // Unsupported scheme.
	'https://mozilla.org', // No path.
	'https://mozilla.*.org/', // "*" in host must be at the start.
	'https://*zilla.org/', // "*" in host must be the only character or be followed by ".".
	'http*://mozilla.org/', // "*" in scheme must be the only character.
	'https://mozilla.org:80/', // Host must not include a port number.
	'*://*', // Empty path: this should be "*://*/*".
	'file://*', // Empty path: this should be "file:///*".
]
