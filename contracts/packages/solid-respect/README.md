# SolidRespect

An ERC-20-compatible non-transferrable Respect token where the entire distribution is fixed at deployment time.

## Overview

SolidRespect is designed for migrating an existing Respect distribution to another chain as a static snapshot. The constructor accepts parallel arrays of addresses and balances, which are set immutably — there is no minting or burning after deployment.

The contract implements both the `IERC20` and `IRespect` interfaces but all transfer, approval, and allowance operations revert with `OpNotSupported`, since Respect is soulbound.

### Constructor Parameters

| Parameter | Description |
|---|---|
| `name_` | Token name |
| `symbol_` | Token symbol |
| `addresses` | Array of account addresses to receive Respect |
| `balances` | Array of Respect amounts (must match `addresses` length) |

## Build and Test

```shell
npm run build        # compile contracts
npm run test         # run Hardhat tests
npm run test-gas     # run tests with gas reporting
```
