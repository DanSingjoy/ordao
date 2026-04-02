# Ornode

A Node.js service that provides availability of data which is not stored onchain but is necessary for ORDAO apps. It watches OREC and Respect1155 contract events, indexes proposals/votes/awards, and serves them through an API.

Built with Express ([express-zod-api](https://github.com/RobinTail/express-zod-api)) and MongoDB for persistence.

## Prerequisites

- **Node.js** (≥ 16)
- **MongoDB** (local or remote)
- A JSON-RPC / WebSocket provider URL for the target chain

## Configuration

Ornode is configured via a JSON file. The path is set by the `ORNODE_CFG_PATH` environment variable (defaults to `./dev-config.json`).

See `ornode-cfg-template.json` for a full example. Key fields:

| Field | Description |
|---|---|
| `providerUrl` | JSON-RPC or WebSocket URL for the blockchain provider |
| `contracts.orec` | Address of the OREC contract |
| `contracts.newRespect` | Address of the Respect1155 contract |
| `contracts.oldRespect` | *(optional)* Address of an older Respect contract |
| `tokenMetadataCfg` | Metadata templates for award NTTs, fungible Respect, and the contract itself |
| `mongoCfg.url` | MongoDB connection string |
| `mongoCfg.dbName` | Database name |
| `ornode.host` | Listen host (default: `localhost`) |
| `ornode.port` | Listen port (default: `8090`) |
| `ornode.startPeriodNum` | Period number to start indexing from |
| `ornode.listenForEvents` | Whether to subscribe to live contract events |
| `ornode.sync` | *(optional)* If set, runs in sync mode (indexes a block range then exits). Useful for catching up on missed blockchain events (e.g. if ornode was down while events were emitted) |

## API Endpoints

All endpoints are under `/v1/`. POST endpoints accept JSON bodies.

| Endpoint | Method | Description |
|---|---|---|
| `/v1/putProposal` | POST | Submit a proposal (offchain metadata) |
| `/v1/getProposal` | POST | Get a single proposal by ID |
| `/v1/getProposals` | POST | Query proposals with filters |
| `/v1/getPeriodNum` | GET | Get the current period number |
| `/v1/getToken` | POST | Get token metadata by token ID |
| `/v1/token/:tokenId` | GET | Get token metadata (URL param variant) |
| `/v1/getAward` | POST | Get a specific Respect award by token ID |
| `/v1/getAwards` | POST | Query awards with filters |
| `/v1/getRespectMetadata` | POST | Get fungible Respect token metadata |
| `/v1/getRespectContractMt` | POST | Get Respect contract-level metadata |
| `/v1/respectContractMetadata` | GET | Get Respect contract-level metadata (GET variant) |
| `/v1/getVotes` | POST | Query votes with filters |

A Swagger UI is also available via `npm run swagger-ui`.

## Build and Run

```shell
npm run build            # compile TypeScript
npm run start            # start the server (uses dev-config.json by default)
```

## Development

```shell
npm run dev              # start MongoDB + nodemon (auto-reload on changes)
npm run dev-clean        # wipe local MongoDB data and start fresh
npm run dev-erc20        # dev mode with ERC-20 config
npm run build-watch      # watch mode for TypeScript compilation
```

For remote/testnet configurations, create a `*-config.private.json` file (gitignored) and use the corresponding script, e.g.:

```shell
npm run dev:op-sepolia   # uses op-sepolia-config.private.json
```

## Other Scripts

| Script | Description |
|---|---|
| `npm run gen-client` | Generate an API client from the routing definition |
| `npm run swagger-ui` | Start Swagger UI server |
| `npm run backup` | Run MongoDB dump (see `scripts/mongoDump.js`) |
