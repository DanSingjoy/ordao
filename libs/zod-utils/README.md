# zod-utils

[![npm](https://img.shields.io/npm/v/@ordao/zod-utils)](https://www.npmjs.com/package/@ordao/zod-utils)

Helper utilities for working with [Zod](https://zod.dev/) schemas. Provides runtime reflection over Zod types — extracting type information, field metadata, descriptions, and constraint details from schemas.

## Installation

```shell
npm install @ordao/zod-utils
```

## API

### Schema Reflection

The main export is `getTypeInfo`, which recursively inspects a Zod schema and returns a `TypeInfo` discriminated union describing its structure.

```ts
import { getTypeInfo } from "@ordao/zod-utils";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100).describe("User name\n\nFull legal name"),
  age: z.number().optional(),
});

const info = getTypeInfo(schema);
// info.typeName === 'object'
// info.fields.name.typeName === 'string'
// info.fields.age.optional === true
```

#### Supported Zod Types

`ZodObject`, `ZodArray`, `ZodString`, `ZodNumber`, `ZodBigInt`, `ZodBoolean`, `ZodLiteral`, `ZodOptional`, `ZodNullable`, `ZodDefault`, `ZodEffects`, `ZodPipeline`

#### `TypeInfo` Variants

| Variant | `typeName` | Extra Fields |
|---|---|---|
| `PrimitiveTypeInfo` | `'number'`, `'bigint'`, `'boolean'` | — |
| `StringTypeInfo` | `'string'` | `checks` (Zod string validations) |
| `LiteralTypeInfo` | `'literal'` | `value` |
| `ObjectTypeInfo` | `'object'` | `fields` (Record of child `TypeInfo`) |
| `ArrayTypeInfo` | `'array'` | `elementType`, `min?`, `max?` |

All variants share: `schema`, `optional?`, `defaultValue?`, `title?`, `description?`.

### Description Extraction

```ts
import { extractZodDescription } from "@ordao/zod-utils";

const schema = z.string().describe("Title\n\nLonger description here");
const { title, description } = extractZodDescription(schema);
// title === "Title"
// description === "Longer description here"
```

### String Constraint Helpers

| Function | Description |
|---|---|
| `strTypeLength(info)` | Exact length constraint, if any |
| `strTypeMinLength(info)` | Min length (or exact length) |
| `strTypeMaxLength(info)` | Max length (or exact length) |

### Unwrap Helpers

| Function | Description |
|---|---|
| `zodEffectInnerType(effect)` | Inner type of `ZodEffects` |
| `zodOptionalInnerType(opt)` | Inner type of `ZodOptional` |
| `zodNullableInnerType(nul)` | Inner type of `ZodNullable` |
| `zodPipelineInnerType(pipe)` | Output type of `ZodPipeline` |
| `zodDefaultValue(schema)` | Default value of `ZodDefault` |
| `zodDefaultInnerType(schema)` | Inner type of `ZodDefault` |
| `zodLiteralInnerType(lit)` | Value of `ZodLiteral` |
| `zodObjectFields(obj)` | Field `TypeInfo` map of `ZodObject` |
| `zodArrayElementType(arr)` | Element `TypeInfo` of `ZodArray` |
| `zodArrayMinLength(arr)` | Min length constraint of `ZodArray` |
| `zodArrayMaxLength(arr)` | Max length constraint of `ZodArray` |
| `zodStringChecks(str)` | String validation checks |

## Build

```shell
npm run build          # compile CJS and ESM outputs
npm run build-clean    # clean and rebuild
```
