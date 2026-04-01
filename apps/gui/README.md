# ORDAO GUI

Frontend application for interacting with ORDAO (Optimistic Respect-based DAO). Built with React, Vite, Chakra UI, and TanStack Router.

## Tech Stack

- **React 19** with TypeScript
- **Vite** (SWC plugin) for bundling and dev server
- **Chakra UI v3** for components and styling
- **TanStack Router** for file-based routing
- **Privy** for wallet authentication
- **[`@ordao/orclient`](../../libs/orclient/)** for blockchain and ornode communication
- **[`@ordao/privy-react-orclient`](../../libs/privy-react-orclient/)** for React hooks integrating orclient with Privy

## Configuration

The app is configured through Vite environment variables. Create a `.env` file (or use mode-specific files like `.env.development`) with:

| Variable | Description |
|---|---|
| `VITE_APP_TITLE` | Display title for the app |
| `VITE_NEW_RESPECT_ADDR` | Respect1155 contract address |
| `VITE_OREC_ADDR` | OREC contract address |
| `VITE_ORNODE_URL` | Ornode API URL |
| `VITE_CHAIN_ID` | Chain ID (hex) |
| `VITE_RPC_URLS` | Comma-separated RPC URLs |
| `VITE_CHAIN_NAME` | Chain display name |
| `VITE_BLOCKEXP_URL` | Block explorer URL |
| `VITE_PRIVY_APP_ID` | Privy application ID |
| `VITE_DOCS_ORIGIN` | Origin URL for orclient-docs (for browser console) |
| `VITE_PARENT_RESPECT_LINK` | Link to parent Respect contract on block explorer |
| `VITE_CHILD_RESPECT_LINK` | Link to child Respect token on block explorer |
| `VITE_RESPECT_GAME_LINK` | Link to the Respect Game app |
| `VITE_DEF_BREAKOUT_TYPE` | Default breakout type (e.g. `respectBreakout`, `respectBreakoutX2`) |
| `VITE_FRACTAL_DOCS_URL` | *(optional)* URL for fractal documentation |

See `.env.development` for a local development example.

## Development

```shell
npm run dev              # start dev server on port 5175 (local hardhat)
npm run dev-op-sepolia   # dev against OP Sepolia testnet
npm run dev-of2          # dev against Optimism Fractal deployment
npm run build            # production build
npm run preview          # preview production build
npm run lint             # run ESLint
```
