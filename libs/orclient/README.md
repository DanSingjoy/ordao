# Orclient

[![npm](https://img.shields.io/npm/v/@ordao/orclient)](https://www.npmjs.com/package/@ordao/orclient)

Library for client-side ORDAO apps / frontends, that abstracts all the communication with the backend and blockchain. You can use it to create custom frontends for ORDAO apps or to query and interact with ORDAO apps in other contexts.

**[Full API documentation](https://orclient-docs.frapps.xyz/)**

## Why Use Orclient?

ORDAO apps store only **proposal hashes onchain** — the full proposal content and metadata lives offchain on the [ornode](../../services/ornode/). Interacting with the contracts directly would require you to manually manage this split. Orclient handles it for you:

- **Proposal upload.** When you create a proposal, orclient validates the request, encodes it into onchain content + offchain attachment, submits the onchain transaction, and then uploads the full proposal to the ornode — retrying if needed.
- **Input translation.** User-friendly inputs (e.g. Respect Game rankings) are translated into the low-level contract calls (mint amounts, token IDs, calldata) via the [ortypes](../ortypes/) translation layer. This design enables smart contracts that are simple, decoupled from application logic and specifics of consensus building games and their apps.
- **Consistent reads.** When retrieving proposals, orclient fetches data from both the blockchain and the ornode, merging and validating them to give you a single, consistent `Proposal` object with decoded content.

If you are building a React app with [Privy](https://www.privy.io/) for authentication, use [`@ordao/privy-react-orclient`](../privy-react-orclient/) which provides React hooks (`useOrclient`, `useOrclientWithBackup`) and a context provider that handle wallet connection and orclient lifecycle for you.

## Installation

```shell
npm install @ordao/orclient
```

## Quick Start

### Browser (with wallet)

Use `createOrclient` with a built-in deployment and an EIP-1193 provider (e.g. from MetaMask):

```ts
import { createOrclient } from "@ordao/orclient/createOrclient.js";

const client = await createOrclient("of", window.ethereum);

// Read proposals
const proposals = await client.getProposals({ limit: 10 });

// Vote on a proposal
await client.vote(proposals[0].id, "Yes");
```

The first argument is a deployment key. Available keys: `"of"` (Optimism Fractal), `"oh"` (ORDAO Office Hours), `"orf"` (ORDAO Fractal), `"buildium"` (Buildium Fractal), `"ef"` (Eden Fractal), `"op-sepolia"` (test deployment). You can also pass a custom `DeploymentInfo` object instead.

### Read-only (no wallet)

Use `createOrclientReader` when you only need to query data or EIP-1193 provider is not available:

```ts
import { createOrclientReader } from "@ordao/orclient/createOrclient.js";

const reader = await createOrclientReader("of", "https://mainnet.optimism.io/");
const awards = await reader.getAwards({ limit: 20 });
```

## Classes

### `ORClientReader`

Read-only client. Provides all query methods.

### `ORClient` (extends `ORClientReader`)

Full client that adds proposal submission, voting, and execution. Requires a signer.

## API Overview

### Reading

| Method | Description |
|---|---|
| `getProposal(id)` | Get a proposal by `PropId` or `OffchainPropId` |
| `getProposals(spec?)` | Query proposals (latest to oldest), with optional filters for stage, vote status, exec status |
| `getRespectOf(account)` | Get Respect balance of an account |
| `getOldRespectOf(account)` | Get old (parent) Respect balance |
| `getPeriodNum()` | Get current period number |
| `getNextMeetingNum()` | Get next meeting number (period + 1) |
| `getLastMeetingNum()` | Get last meeting number (= period) |
| `getToken(tokenId)` | Get metadata of a fungible or non-fungible Respect token |
| `getAward(tokenId)` | Get metadata of a specific Respect award NTT |
| `getAwards(spec?)` | Query awards (latest to oldest), filterable by recipient, date, burned status |
| `getRespectMetadata()` | Get fungible Respect token metadata |
| `getVotes(spec?)` | Query votes (newest to oldest), filterable by proposal, voter, weight, type |
| `getVoteLength()` | Get vote period duration (ms) |
| `getVetoLength()` | Get veto period duration (ms) |
| `getMinWeight()` | Get minimum passing weight |
| `getMaxLiveYesVotes()` | Get max simultaneous live yes-votes per account |

### Proposing (ORClient only)

All `propose*` methods accept an optional `vote` parameter (default: `{ vote: "Yes" }`). Set `{ vote: "None" }` to create a proposal without voting.

| Method | Description |
|---|---|
| `proposeBreakoutResult(req, vote?)` | Propose Respect awards for a breakout room based on rankings |
| `proposeBreakoutResultX2(req, vote?)` | Same as above but with doubled Respect amounts |
| `proposeRespectTo(req, vote?)` | Propose a single Respect award to an account |
| `proposeRespectAccountBatch(req, vote?)` | Propose multiple Respect awards at once |
| `proposeBurnRespect(req, vote?)` | Propose burning a single Respect award |
| `proposeBurnRespectBatch(req, vote?)` | Propose burning multiple Respect awards |
| `proposeCustomSignal(req, vote?)` | Propose a custom signal event from OREC |
| `proposeTick(req?, vote?)` | Propose a tick signal (increments the period number) |
| `proposeCustomCall(req, vote?)` | Propose an arbitrary EVM call via OREC |
| `proposeSetPeriods(req, vote?)` | Propose new vote/veto period lengths |
| `proposeSetMinWeight(req, vote?)` | Propose a new minimum passing weight |
| `proposeSetMaxLiveYesVotes(req, vote?)` | Propose a new max live yes-votes limit |
| `proposeCancelProposal(req, vote?)` | Propose cancellation of a live proposal |

### Voting & Execution (ORClient only)

| Method | Description |
|---|---|
| `vote(propId, voteType, memo?)` | Vote on a proposal ("Yes" or "No", with optional memo) |
| `execute(propId)` | Execute a passed proposal |

## Examples

### Submit breakout room results

```ts
await client.proposeBreakoutResult({
  meetingNum: 1,
  groupNum: 1,
  rankings: [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
  ]
});
```

### Query votes for a specific proposal

```ts
const votes = await client.getVotes({
  propFilter: ["0xcc55ee4f4b5d61a9b90b5a5d915d8e7edede19e26b1a68be043d837654313760"],
  limit: 10
});
```

### Burn multiple awards

```ts
await client.proposeBurnRespectBatch({
  tokenIds: [
    "0x000000010000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "0x00000001000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8"
  ],
  reason: "cleanup"
});
```

## Build

```shell
npm run build          # compile CJS and ESM outputs
npm run build-clean    # clean and rebuild
```
