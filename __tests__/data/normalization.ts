export const wellFormed = [
	{ pattern: '*://*/fo^', accept: ['http://example.com/fo%5e'], reject: [] },
	{
		pattern: '*://*/fo|a)',
		accept: ['http://example.com/fo%7ca)'],
		reject: [],
	},
	{
		pattern: '*://*/[fo])',
		accept: ['http://example.com/%5bfo%5d)'],
		reject: [],
	},
	{
		pattern: '*://*/fo{1,2}',
		accept: ['http://a.co/fo%7b1,2%7d'],
		reject: [],
	},

	{ pattern: '*://*/fo%5e', accept: ['http://example.com/fo^'], reject: [] },
	{
		pattern: '*://*/fo%7ca)',
		accept: ['http://example.com/fo|a)'],
		reject: [],
	},
	{
		pattern: '*://*/%5bfo%5d)',
		accept: ['http://example.com/[fo])'],
		reject: [],
	},
	{
		pattern: '*://*/fo%7b1,2%7d',
		accept: ['http://a.co/fo{1,2}'],
		reject: [],
	},
	{
		pattern: '*://*/fo%7b1,2%7d',
		accept: ['http://a.co/fo{1,2}'],
		reject: [],
	},
	{
		pattern: 'https://exÆmple.com/*',
		accept: ['https://xn--exmple-qua.com'],
		reject: [],
	},
	{
		pattern: 'https://ex%C3%A6mple.com/*',
		accept: ['https://xn--exmple-qua.com'],
		reject: [],
	},
	{
		pattern: 'https://xn--exmple-qua.com/*',
		accept: ['https://exÆmple.com', 'https://ex%C3%A6mple.com'],
		reject: [],
	},

	{
		pattern: 'https://*.exÆmple.com/*',
		accept: ['https://foo.xn--exmple-qua.com'],
		reject: [],
	},
	{
		pattern: 'https://*.ex%C3%A6mple.com/*',
		accept: ['https://foo.xn--exmple-qua.com'],
		reject: [],
	},
	{
		pattern: 'https://*.xn--exmple-qua.com/*',
		accept: ['https://foo.exÆmple.com', 'https://bar.baz.ex%C3%A6mple.com'],
		reject: [],
	},
]

export const malformed = []
