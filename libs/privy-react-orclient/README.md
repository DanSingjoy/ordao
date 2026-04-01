# privy-react-orclient

[![npm](https://img.shields.io/npm/v/@ordao/privy-react-orclient)](https://www.npmjs.com/package/@ordao/privy-react-orclient)

React hooks and helpers for using [`@ordao/orclient`](../orclient/) with [Privy](https://www.privy.io/) authentication.

## Installation

```shell
npm install @ordao/privy-react-orclient
```

### Peer Dependencies

- `react` (^18 || ^19)
- `@privy-io/react-auth` (^3.0.1)

## Usage

There are two ways to use this library: standalone hooks or the context-based provider pattern.

### Standalone Hooks

#### `useOrclient`

Creates a full `ORClient` (read + write) when a deployment and connected wallet are available. Returns `undefined` while initializing or if wallet is not connected.

```tsx
import { useOrclient } from "@ordao/privy-react-orclient";
import { useUserWallet } from "@ordao/privy-react-orclient";

function MyComponent() {
  const wallet = useUserWallet();
  const orclient = useOrclient("of", wallet);

  if (!orclient) return <p>Connecting...</p>;

  // orclient is a full ORClient — can read, propose, vote, execute
}
```

#### `useOrclientWithBackup`

Creates a full `ORClient` when wallet is available, but falls back to a read-only `ORClientReader` (using backup RPC URLs) after a timeout. This ensures UI can display data even before the user connects a wallet.

```tsx
import { useOrclientWithBackup } from "@ordao/privy-react-orclient";
import { useUserWallet } from "@ordao/privy-react-orclient";

function MyComponent() {
  const wallet = useUserWallet();
  const { orclient, rpcError } = useOrclientWithBackup(
    ["https://mainnet.optimism.io/"],  // backup RPC URLs
    "of",                               // deployment
    wallet,                             // connected wallet (or undefined)
    undefined,                          // orclient config
    3000                                // timeout (ms) before falling back to reader
  );

  if (rpcError) return <p>RPC connection failed</p>;
  if (!orclient) return <p>Loading...</p>;
  // orclient is ORClient (if wallet connected) or ORClientReader (fallback)
}
```

#### `useUserWallet`

Returns the Privy `ConnectedWallet` matching the authenticated user's wallet address, or `undefined`.

```tsx
import { useUserWallet } from "@ordao/privy-react-orclient";

const wallet = useUserWallet();
```

### Provider Pattern

For apps that need orclient access in many components, use the `OrclientProvider` context. It uses `useOrclientWithBackup` internally, so it immediately provides a read-only `ORClientReader` via the backup RPC URLs, and automatically upgrades to a full `ORClient` once the user connects a wallet:

```tsx
import { OrclientProvider } from "@ordao/privy-react-orclient/backup-provider/OrclientProvider.js";

function App() {
  return (
    <PrivyProvider appId="..." config={...}>
      <OrclientProvider
        deployment="of"
        backupProviderURLs={["https://mainnet.optimism.io/"]}
        orclientConfig={{ propConfirms: 1, otherConfirms: 1, propSubmitRetries: 4, propResubmitInterval: 3000 }}
        timeout={3000}
      >
        <MyApp />
      </OrclientProvider>
    </PrivyProvider>
  );
}
```

Then consume it in child components:

```tsx
import { useOrclient, useAssertOrclient, useAssertFullOrclient, useRpcError } from "@ordao/privy-react-orclient/backup-provider/useOrclient.js";

function ProposalList() {
  const orclient = useOrclient();         // ORClientType | undefined
  const rpcError = useRpcError();         // unknown | undefined
  // or
  const orclient2 = useAssertOrclient();      // throws if undefined
  const fullClient = useAssertFullOrclient(); // throws if not a full ORClient
}
```

## API Reference

### Hooks (top-level)

| Hook | Returns | Description |
|---|---|---|
| `useOrclient(deployment?, wallet?, config?)` | `ORClient \| undefined` | Full client, requires wallet |
| `useOrclientWithBackup(rpcUrls, deployment?, wallet?, config?, timeout?)` | `{ orclient, rpcError }` | Full client with read-only fallback |
| `useUserWallet()` | `ConnectedWallet \| undefined` | Privy user's connected wallet |

### Provider exports (`backup-provider/`)

| Export | Description |
|---|---|
| `OrclientProvider` | React context provider component |
| `useOrclient()` | Get orclient from context |
| `useAssertOrclient()` | Get orclient from context, throws if undefined |
| `useAssertFullOrclient()` | Get full `ORClient` from context, throws if read-only |
| `useRpcError()` | Get RPC error from context (if any) |
| `OrclientUndefined` | Error class thrown by `useAssertOrclient` when orclient is undefined |
| `OrclientNotFull` | Error class thrown by `useAssertFullOrclient` when orclient is read-only |

### Factory functions

| Function | Description |
|---|---|
| `create(deployment, wallet, config?)` | Create a full `ORClient` from a Privy `ConnectedWallet` |
| `createReader(deployment, providerUrls, config?)` | Create a read-only `ORClientReader` with fallback URLs |

## Build

```shell
npm run build          # compile CJS and ESM outputs
npm run build-clean    # clean and rebuild
```