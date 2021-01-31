// Ensure compatibility with https://github.com/nickclaw/url-match-patterns

// (The MIT License)

// Copyright(c) 2017 Nicholas Clawson <nickclaw@gmail.com>

// 	Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files(the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// 	distribute, sublicense, and / or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// 	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

export const wellFormed = [
	// https://github.com/nickclaw/url-match-patterns/blob/master/test/regression.js

	{ pattern: '*://*/fo?o', accept: [], reject: ['http://example.com/fo'] },

	{ pattern: '*://*/f.o', accept: [], reject: ['http://example.com/foo'] },

	{ pattern: '*://*/fo+', accept: [], reject: ['http://example.com/foo'] },

	{
		pattern: '*://*/fo{1,2}',
		accept: [],
		reject: ['http://example.com/foo'],
	},

	{ pattern: '*://*/fo^', accept: ['http://example.com/fo^'], reject: [] },

	{ pattern: '*://*/fo$', accept: ['http://example.com/fo$'], reject: [] },

	{ pattern: '*://*/fo(', accept: ['http://example.com/fo('], reject: [] },

	{ pattern: '*://*/fo)', accept: ['http://example.com/fo)'], reject: [] },

	{
		pattern: '*://*/fo|a)',
		accept: ['http://example.com/fo|a)'],
		reject: [],
	},

	{
		pattern: '*://*/[fo])',
		accept: ['http://example.com/[fo])'],
		reject: [],
	},

	// https://github.com/nickclaw/url-match-patterns/blob/master/test/fixtures/chrome-examples.js
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
			// the example here was wrong
			//   'http://www.google.com/foo/baz/bar',
			//   'http://docs.google.com/foobar',
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

	// https://github.com/nickclaw/url-match-patterns/blob/master/test/fixtures/firefox-examples.js

	{
		pattern: '<all_urls>',
		accept: [
			'http://example.org/',
			'ftp://files.somewhere.org/',
			'https://a.org/some/path/',
		],
		reject: ['resource://a/b/c/'],
	},
	{
		pattern: '*://*.mozilla.org/*',
		accept: [
			'http://mozilla.org/',
			'https://mozilla.org/',
			'http://a.mozilla.org/',
			'http://a.b.mozilla.org/',
			'https://b.mozilla.org/path/',
		],
		reject: [
			'ftp://mozilla.org/',
			'http://mozilla.com/',
			'http://firefox.org/',
		],
	},
	{
		pattern: '*://mozilla.org/',
		accept: ['http://mozilla.org/', 'https://mozilla.org/'],
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
		],
	},
	{
		pattern: 'https://*/path/',
		accept: [
			'https://mozilla.org/path/',
			'https://a.mozilla.org/path/',
			'https://something.com/path/',
		],
		reject: [
			'http://mozilla.org/path/',
			'https://mozilla.org/path',
			'https://mozilla.org/a',
			'https://mozilla.org/',
		],
	},
	{
		pattern: 'https://mozilla.org/*',
		accept: [
			'https://mozilla.org/',
			'https://mozilla.org/path',
			'https://mozilla.org/another',
			'https://mozilla.org/path/to/doc',
		],
		reject: ['http://mozilla.org/path', 'https://mozilla.com/path'],
	},
	{
		pattern: 'https://mozilla.org/a/b/c/',
		accept: ['https://mozilla.org/a/b/c/'],
		reject: [],
	},
	{
		pattern: 'https://mozilla.org/*/b/*/',
		accept: [
			'https://mozilla.org/a/b/c/',
			'https://mozilla.org/d/b/f/',
			'https://mozilla.org/a/b/c/d/',
		],
		reject: ['https://mozilla.org/b/*/', 'https://mozilla.org/a/b/'],
	},
	{
		pattern: 'file:///blah/*',
		accept: ['file:///blah/', 'file:///blah/bleh'],
		reject: ['file:///bleh/'],
	},
]

export const badlyFormed = [
	// https://github.com/nickclaw/url-match-patterns/blob/master/test/fixtures/firefox-examples.js

	'resource://path/',
	'https://mozilla.org',
	'https://mozilla.*.org/',
	'https://*zilla.org/',
	'http*://mozilla.org/',
	'file://*',
]
