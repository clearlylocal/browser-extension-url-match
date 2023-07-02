# browser-extension-url-match

Robust, configurable URL pattern matching, conforming to the algorithm used by [Chrome](https://developer.chrome.com/docs/extensions/mv3/match_patterns/) and [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) browser extensions.

* ESM import (browser, Deno): `import { matchPattern } from 'https://esm.sh/browser-extension-url-match@1.0.0'`
* [NPM module](https://www.npmjs.com/package/browser-extension-url-match) (Node): `npm i browser-extension-url-match`

This library uses the native [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor and [`Array#flatMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap). Polyfills may be required if you need to support Internet Explorer or Node.js <= 11.X.

## Usage

### Basic usage with `matchPattern`

The `matchPattern` function takes a pattern or array of patterns as input and returns a valid or invalid `Matcher` object:
* If all input patterns are valid, `matcher.valid` will be `true`.
* If one or more input patterns are invalid, `matcher.valid` will be `false`, and `matcher.error` will contain a diagnostic error object.

Calling `matcher.assertValid` asserts that the matcher is valid and throws an error at runtime if it isn’t.

By default, matchers use Chrome presets with strict URL matching.

```ts
import { matchPattern } from 'browser-extension-url-match'

const matcher = matchPattern('https://example.com/foo/*').assertValid()

matcher.match('https://example.com/foo/bar') // ⇒ true
matcher.match('https://example.com/bar/baz') // ⇒ false

const matcher2 = matchPattern([
    'https://example.com/foo/*',
    'https://example.com/bar/*',
]).assertValid()

matcher2.match('https://example.com/foo/bar') // ⇒ true
matcher2.match('https://example.com/bar/baz') // ⇒ true

const matcher3 = matchPattern('<all_urls>').assertValid()

matcher3.match('https://example.com/foo/bar') // ⇒ true

const invalidMatcher = matchPattern('htp://example.com/*')

invalidMatcher.valid // ⇒ false
invalidMatcher.error // ⇒ TypeError: Scheme "htp" is not supported
invalidMatcher.assertValid() // throws TypeError at runtime
```

### Working with user input

If the input patterns are hard coded, calling `assertValid` is a way of telling the TypeScript compiler that they’re assumed to be valid. However, if patterns are supplied from user input or other sources with unknown integrity, it’s usually better to check the `valid` property, which allows TypeScript to correctly infer the type:

```ts
const matcherInput = form.querySelector<HTMLInputElement>('input#matcher')!
const checkBtn = form.querySelector<HTMLButtonlement>('button#check')!

checkBtn.addEventListener('click', () => {
    const matcher = matchPattern(matcherInput.value)

    // type narrowing via ternary operator
    matcherInput.setCustomValidity(matcher.valid ? '' : matcher.error.message)
    matcherInput.reportValidity()

    // type narrowing via `if ... else`
    if (matcher.valid) {
        const url = prompt('Enter URL to match against')
        alert(matcher.match(url ?? '') ? 'Matched!' : 'Unmatched')
    } else {
        console.error(matcher.error.message)
    }
})
```

### Configuration options

You can customize `matchPattern` by supplying options in the second argument.

```ts
import { matchPattern } from 'browser-extension-url-match'

const options = {
    supportedSchemes: ['http', 'https', 'ftp', 'ftps'],
}

matchPattern('ftps://*/*', options)
    .assertValid()
    .match('ftps://example.com/foo/bar')
// ⇒ true
```

The available configuration options are as follows:

#### `strict`

If set to `false`, the specified path segment is ignored and is always treated as `/*`. This corresponds to the behavior when specifying [host permissions](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/).

**Default:** `true`.

#### `supportedSchemes`

An array of schemes to allow in the pattern. Available schemes are `http`, `https`, `ws`, `wss`, `ftp`, `ftps`, and `file`.

`data` and `urn` are not currently supported, due to limited implementation and unclear semantics.

**Default:** `['http', 'https', 'file', 'ftp']`

#### `schemeStarMatchesWs`

If `true`, `*` in the scheme will match `ws` and `wss` as well as `http` and `https`, which is the default behavior in Firefox.

**Default:** `false`

### Chrome and Firefox presets

Presets are available to provide defaults based on what Chrome and Firefox support.

```ts
import { matchPattern, presets } from 'browser-extension-url-match'

const matcher = matchPattern('*://example.com/', presets.firefox)

matcher.assertValid().match('ws://example.com') // ⇒ true
```

You can also combine presets with custom options:

```ts
const options = {
    ...presets.firefox,
    strict: false,
}

matchPattern('wss://example.com/', options)
    .assertValid()
    .match('wss://example.com/foo/bar')
// ⇒ true
```

### Generating examples

You can also generate an array of examples matching URL strings from a valid `Matcher` object.

```ts
matchPattern('https://*.example.com/*').assertValid().examples
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
```
