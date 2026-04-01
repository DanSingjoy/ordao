# ts-utils

[![npm](https://img.shields.io/npm/v/@ordao/ts-utils)](https://www.npmjs.com/package/@ordao/ts-utils)

Shared TypeScript utility functions used across ORDAO packages.

## Installation

```shell
npm install @ordao/ts-utils
```

## API

### Types

| Export | Description |
|---|---|
| `SafeRecord<K, V>` | Like `Record` but values are `V \| undefined`, forcing existence checks on access |

### Serialization

| Function | Description |
|---|---|
| `stringify(obj, flatten?, stringifyErrors?)` | `JSON.stringify` wrapper that handles `bigint` values and optionally flattens inherited properties |
| `flatStringify(obj)` | Shorthand for `stringify(obj, true, true)` — flattens one level of prototype chain and includes error properties |

### Object Helpers

| Function | Description |
|---|---|
| `deleteUndefined(obj)` | Recursively delete `undefined` properties in place |
| `withoutUndefined(obj)` | Return a new object with `undefined` properties removed (recursive) |
| `withoutProperty(obj, key)` | Return a shallow copy of `obj` without the specified `key` |
| `flattenObj(obj, ignoreKeys?)` | Recursively flatten nested objects into dot-separated keys (e.g. `{ a: { b: 1 } }` → `{ "a.b": 1 }`) |

### Async

| Function | Description |
|---|---|
| `sleep(ms)` | Promise that resolves after `ms` milliseconds |

### Error Handling

| Export | Description |
|---|---|
| `ErrorWithCause` | Error subclass that stores a `cause` property |
| `assertUnreachable(x: never)` | Compile-time exhaustiveness check helper; throws at runtime if reached |

## Build

```shell
npm run build          # compile CJS and ESM outputs
npm run build-clean    # clean and rebuild
```
