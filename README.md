# browser-extension-url-match

Robust, configurable URL pattern matching, conforming to the algorithm used by [Chrome](https://developer.chrome.com/docs/extensions/mv3/match_patterns/) and [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) browser extensions.

[`npm i browser-extension-url-match`](https://www.npmjs.com/package/browser-extension-url-match)

This library uses the native [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor and [`Array#flatMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap). Polyfills may be required if you need to support Internet Explorer or Node.js <= 11.X.

## Usage

### Basic usage with `matchPattern`

`matchPattern` returns a `Matcher` object that can be used to match against URLs.

```ts
const matchPattern: (pattern: string) => Matcher

export type Matcher = {
    valid: boolean
    error?: Error
    match: MatchFn
    examples: string[]
    pattern: string
    config: MatchPatternOptions
}
```

The default `matchPattern` function uses Chrome presets with strict URL matching.

```ts
import { matchPattern } from 'browser-extension-url-match'

const matcher = matchPattern('https://example.com/foo/*')

matcher.match('https://example.com/foo/bar')
// ⇒ true
matcher.match('https://example.com/bar/baz')
// ⇒ false
```

If the supplied pattern is invalid:
* `matcher.valid` will be set to `false`.
* `matcher.match` will always return `false`, regardless of the URL.
* `matcher.error` will contain an error with diagnostic information.

```ts
const invalidMatcher = matchPattern('htp://example.com/*')

invalidMatcher.valid
// ⇒ false
invalidMatcher.error
// ⇒ Error: Scheme "htp" is not supported
invalidMatcher.match('htp://example.com/')
// ⇒ false

const validMatcher = matchPattern('<all_urls>')

validMatcher.valid
// ⇒ true
validMatcher.error
// ⇒ undefined
validMatcher.match('https://example.com/foo/bar')
// ⇒ true
```

### Configuration options

You can create a customized version of `matchPattern` using `matchPatternWithConfig`.

```ts
import { matchPatternWithConfig } from 'browser-extension-url-match'

const matchPattern = matchPatternWithConfig({
    supportedSchemes: ['http', 'https', 'ftp', 'ftps'],
})

matchPattern('ftps://*/*').match('ftps://example.com/foo/bar')
// ⇒ true
```

The available configuration options are as follows:

#### `strict`

If set to `false`, the specified path segment is ignored and is always treated as `/*`. This corresponds to the behavior when specifying [host permissions](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/).

**Default:** `true`.

#### `supportedSchemes`

An array of schemes to allow in the pattern. Available schemes are `http`, `https`, `ws`, `wss`, `ftp`, `ftps`, and `file`.

`data` is not supported, due to very limited implementation and unclear semantics.

**Default:** `['http', 'https', 'file', 'ftp']`

#### `schemeStarMatchesWs`

If `true`, `*` in the scheme will match `ws` and `wss` as well as `http` and `https`, which is the default behavior in Firefox.

**Default:** `false`

### Chrome and Firefox presets

Presets are available to provide defaults based on what Chrome and Firefox support.

```ts
import { matchPatternWithConfig, presets } from 'browser-extension-url-match'

const matchPattern = matchPatternWithConfig(presets.firefox)

const matcher = matchPattern('*://example.com/')

matcher.match('ws://example.com')
// ⇒ true
```

You can also combine presets with custom options:

```ts
const matchPattern = matchPatternWithConfig({
    ...presets.firefox,
    strict: false,
})

matchPattern('wss://example.com/').match('wss://example.com/foo/bar')
// ⇒ true
```

### Generating examples

You can generate an array of example matching URL strings from any `Matcher` object. The array will be empty if the matcher is invalid.

```ts
matchPattern('https://*.example.com/*').examples
// ⇒ [
//     'https://example.com/',
//     'https://example.com/foo',
//     'https://example.com/bar/baz/',
//     'https://www.example.com/',
//     'https://www.example.com/foo',
//     'https://www.example.com/bar/baz/',
//     'https://foo.bar.example.com/',
//     'https://foo.bar.example.com/foo',
//     'https://foo.bar.example.com/bar/baz/',
// ]

matchPattern('INVALID').examples
// ⇒ []
```
