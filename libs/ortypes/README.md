# Ortypes

[![npm](https://img.shields.io/npm/v/@ordao/ortypes)](https://www.npmjs.com/package/@ordao/ortypes)

TypeScript types, Zod schemas, and helper utilities that form the shared domain model for ORDAO. Ortypes defines the interfaces between all ORDAO components — [orclient](../orclient/), [ornode](../../services/ornode/), and the smart contracts ([OREC](../../contracts/packages/orec/), [Respect1155](../../contracts/packages/respect1155/)).

## Role in the Architecture of ORDAO

The ORDAO codebase is inspired by principles of [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) (Robert C. Martin) (also see [onion architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) (Jeffrey Palermo), and [hexagonal architecture](https://alistair.cockburn.us/hexagonal-architecture/) (Alistair Cockburn)).

Ortypes (together with the contract packages) forms the **innermost layer** of this architecture — the domain model. All other components depend on it, but it depends on nothing application-specific.

This design enables:

- **Code reuse across frontend and backend.** The same Zod schemas validate form inputs in the GUI and API request payloads in the ornode. For example, `zRespectBreakoutRequest` validates a breakout result submission identically whether it originates from a browser or an API call.

- **A translation layer that keeps smart contracts simple.** ORDAO smart contracts are deliberately minimal — [OREC](../../contracts/packages/orec/) handles transaction execution, [Respect1155](../../contracts/packages/respect1155/) manages tokens — each [doing one thing well](https://en.wikipedia.org/wiki/Unix_philosophy). The complexity of translating user-facing concepts (like Respect Game rankings) into contract calls lives in ortypes. This means the contracts don't need to be coupled to application logic (like the ranking system) that may change over time (more often than smart contracts) and attack surface of the most critical part of the system (contracts) is reduced.

- **Independent of UI.** The domain model in ortypes does not depend on any UI framework. The GUI can be swapped or rewritten (e.g. from React to another framework) without changing the core types, validation, or translation logic.

- **Independent of Database.** The domain model does not depend on any particular storage backend. The ornode could switch its database implementation without affecting ortypes, orclient, or the GUI — only the ornode's internal storage layer would change.

## Installation

```shell
npm install @ordao/ortypes
```

## Modules

Ortypes is organized into focused modules, each importable via subpath exports:

### Core Types

| Module | Import | Description |
|---|---|---|
| `eth` | `@ordao/ortypes` | Ethereum primitives — `zEthAddress`, `zBytes`, `zBytes32`, `zTxHash`, `zUint`, type guards |
| `common` | `@ordao/ortypes` | Shared primitives — `zUrl`, `zTimestamp`, `InvalidArgumentError` |
| `fractal` | `@ordao/ortypes` | Fractal/DAO concepts — `PropType` enum, rankings, reward value tables, breakout schemas |

### Contract Bindings

| Module | Import | Description |
|---|---|---|
| `orec` | `@ordao/ortypes` | OREC types — `Stage`, `VoteStatus`, `ExecStatus`, `PropId`, `VoteType`, `ProposalState`, contract factory, event types |
| `respect1155` | `@ordao/ortypes/respect1155.js` | Respect1155 types — `TokenId`, `MeetingNum`, `PeriodNum`, `MintType`, mint/burn argument schemas, award metadata (`RespectAwardMt`) |
| `erc1155` | `@ordao/ortypes` | ERC-1155 metadata schema |
| `erc7572` | `@ordao/ortypes` | ERC-7572 contract metadata schema |

### Client Types (`orclient.ts`)

Imported as `@ordao/ortypes/orclient.js`. Defines the client-facing domain model:

- **Proposal types** — `Proposal`, `DecodedProposal`, and all specific types (`RespectBreakout`, `BurnRespect`, `CustomCall`, `Tick`, `SetPeriods`, etc.)
- **Request types** — `RespectBreakoutRequest`, `BurnRespectRequest`, `CustomCallRequest`, etc. — used as input to orclient's `propose*` methods
- **Query specs** — `GetProposalsSpec`, `GetAwardsSpec`, `GetVotesSpec` — pagination and filter schemas
- **Vote types** — `VoteType`, `VoteRequest`, `Vote`, `VoteWeight`
- **Status enums** — `Stage`, `VoteStatus`, `ExecStatus`

### Node Types (`ornode.ts`)

Imported as `@ordao/ortypes/ornode.js`. Defines the ornode storage and API model:

- **Proposal storage** — `ProposalBase`, `ProposalFull`, `StoredProposal` with `PropContent` and `PropAttachment`
- **Attachment types** — per-proposal-type metadata stored offchain (e.g. `RespectBreakoutAttachment`, `BurnRespectAttachment`)
- **Validation refinements** — `zProposalBaseFullValid` checks that proposal content matches its onchain ID and that the memo matches the attachment hash
- **API types** — request/response schemas for ornode endpoints

### Transformers

The `transformers/` directory contains the translation layer between client and node representations:

- **`clientToNodeTransformer.ts`** — Converts client-side proposal requests (e.g. `RespectBreakoutRequest` with rankings) into ornode proposals with onchain content and offchain attachments. This is where rankings are translated into mint calls, token IDs are computed, and calldata is encoded.
- **`nodeToClientTransformer.ts`** — Converts ornode stored proposals back into decoded client-side `Proposal` objects with human-readable fields.

### Context

| Module | Import | Description |
|---|---|---|
| `orContext` | `@ordao/ortypes/orContext.js` | `ORContext` class — holds contract instances, provider, error decoder; provides helpers for reading onchain proposal state, vote/veto time calculations |
| `iornode` | `@ordao/ortypes` | `IORNode` interface — the contract that ornode implementations must satisfy |

## Build

```shell
npm run build          # compile CJS and ESM outputs
npm run build-clean    # clean and rebuild
```
