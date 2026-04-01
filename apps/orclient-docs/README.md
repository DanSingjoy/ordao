# Orclient Docs

Documentation website for [`@ordao/orclient`](../../libs/orclient/), generated from TypeScript source using [TypeDoc](https://typedoc.org/).

**Deployed at: [orclient-docs.frapps.xyz](https://orclient-docs.frapps.xyz/)**

## Build

The build script runs TypeDoc against the orclient source and outputs static HTML to `dist/`:

```shell
npm run build    # generate docs from orclient TypeScript source
```

## Local Preview

```shell
npm run start    # serve docs locally on port 5174
```

## How It Works

The `build` script runs `typedoc` from the orclient package directory, using `libs/orclient/src/orclient.ts` as the entry point. The generated HTML is output to this package's `dist/` folder. No additional configuration files are needed — TypeDoc reads the TSDoc comments directly from the orclient source.
