# Respect1155

A non-transferrable reputation token contract based on ERC-1155. It implements [fungibility out of non-fungible tokens](https://peakd.com/dao/@sim31/fungibility-out-of-non-fungible-tokens).

Respect is awarded as SBT (soulbound token) which can have attributes that signify details like when respect was earned and how. Each Respect SBT also has an associated "value" (or denomination if you will) representing Respect amount the particular SBT represents. This value is stored onchain and determined at the time of issuance. Then there's fungible Respect token, where balance of each account is determined by summing the values of all Respect SBTs an account has earned.

## Token ID Encoding

Token ID 0 is reserved for the fungible Respect token. Non-fungible token IDs encode the owner address in the least-significant 20 bytes, so ownership is derivable directly from the token ID without storage lookups.

## Contract Structure

- **`Respect1155Base`** — abstract base implementing the dual fungible/non-fungible ERC-1155 logic, `IRespect1155`, and `IRespect` interfaces. Transfer and approval operations revert (`OpNotSupported`) since tokens are soulbound.
- **`Respect1155`** — concrete contract adding `Ownable` mint/burn functions (`mintRespect`, `burnRespect`, `mintRespectGroup`, `burnRespectGroup`) and URI management.
- **`IRespect1155`** — interface extending `IERC1155` and `IRespect` with Respect-specific queries (`valueOfToken`, `respectOf`, `respectOfBatch`, `sumRespectOf`, `totalRespect`).

## Build and Test

```shell
npm run build        # compile contracts and TypeScript
npm run test         # run Hardhat tests
npm run test-gas     # run tests with gas reporting
```
