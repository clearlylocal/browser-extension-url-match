export const wellFormed = [
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
]

export const badlyFormed = [
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
]
