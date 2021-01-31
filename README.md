# browser-extension-url-match

Configurable URL pattern matching, as used by [Chrome](https://developer.chrome.com/docs/extensions/mv3/match_patterns/) and [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) browser extensions.

[`npm i browser-extension-url-match`](https://www.npmjs.com/package/browser-extension-url-match)

## Usage

### Basic usage with `matchPattern`

`matchPattern` defaults to Chrome presets with strict URL matching. It returns a function to match URLs against, or `null` if the supplied pattern was invalid.

```ts
const matchUrl = matchPattern('https://example.com/foo/*')

matchUrl!('https://example.com/foo/bar')
// ⇒ true
matchUrl!('https://example.com/bar/baz')
// ⇒ false
```

### `matchPatternWithConfig`

You can create a customized version of `matchPattern` using `matchPatternWithConfig`.

```ts
const matchPattern = matchPatternWithConfig({
    strict: true,
    onInvalid: 'throw',
    supportedSchemes: ['http', 'https', 'ws', 'wss'],
    schemeStarMatchesWs: true,
})

const matchUrl = matchPattern('*://example.com/*')

matchUrl('wss://example.com/foo/bar')
// ⇒ true
```

#### `strict`

If set to `false`, the path segment is always treated as `/*`, corresponding to the behavior when specifying [host permissions](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/).

Default: `true`.

#### `onInvalid`

Changes the behavior of `matchPattern` if the supplied pattern is invalid.

* `'null'` — Returns null
* `'throw'` — Throws an error
* `'debug'` — Returns an error but does not throw
* `'alwaysFalse'` — Returns a function that does not match any URLs

Default: `'null'`.

#### `supportedSchemes`

An array of schemes to allow in the pattern. Available schemes are `'http'`, `'https'`, `'ws'`, `'wss'`, `'ftp'`, `'ftps'`, `'data'`, and `'file'`.

Default: `['http', 'https', 'file', 'ftp']`

#### `schemeStarMatchesWs`

If `true`, `*` in the scheme will match `ws` and `wss` as well as `http` and `https`.

`'http', 'https', 'ws', 'wss', 'ftp', 'ftps', 'data', 'file'`

Default: `false`

#### Chrome and Firefox presets

Presets are available to provide defaults based on what Chrome and Firefox support.

```ts
import { matchPatternWithConfig, presets } from '../src'

const matchPattern = matchPatternWithConfig(presets.firefox)

const matchUrl = matchPattern('*://example.com/')

matchUrl!('ws://example.com')
// ⇒ true
```

You can also combine presets with custom options:

```ts
const matchPattern = matchPatternWithConfig({
    ...presets.firefox,
    onInvalid: 'alwaysFalse',
    strict: false,
})

matchPattern('https://example.com/')('https://example.com/foo/bar')
// ⇒ true

matchPattern('INVALID')('https://example.com/foo/bar')
// ⇒ false
```
