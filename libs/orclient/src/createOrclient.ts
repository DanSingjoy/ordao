import { z } from "zod";
import { ORContext, zEthAddress, zUrl } from "@ordao/ortypes";
import { zChainInfo, ChainInfo, ethCurrency } from "@ordao/ortypes/chainInfo.js";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { Config, ORClient } from "./orclient.js";
import { RemoteOrnode } from "./remoteOrnode.js";

export const zContractsAddrs = z.object({
  oldRespect: zEthAddress.optional(),
  newRespect: zEthAddress,
  orec: zEthAddress
});
export type ContractsAddrs = z.infer<typeof zContractsAddrs>;

export const zDeploymentInfo = z.object({
  title: z.string(),
  contracts: zContractsAddrs,
  ornodeUrl: zUrl,
  chainInfo: zChainInfo
});
export type DeploymentInfo = z.infer<typeof zDeploymentInfo>;

export type DeploymentKey = 
  "op-sepolia" | "oh" | "of2-candidate-1"

export const deployments: Record<DeploymentKey, DeploymentInfo> = {
  "op-sepolia": {
    title: "Optimism Sepolia test deployment",
    contracts: {
      oldRespect: "0x6b11FC2cec86edeEd1F3705880deB9010F0D584B",
      newRespect: "0x3449C30fF5191b9FC1A1eCD8EC90C4EbF54b1204",
      orec: "0x4f778568eCf156bee61825e152864D44C37167Fb"
    },
    ornodeUrl: "https://op-sepolia-ornode.frapps.xyz",
    chainInfo: {
      chainId: "0xAA37DC",
      rpcUrls: [
        "https://sepolia.optimism.io"
      ],
      chainName: "OP Sepolia",
      blockExplorerUrl: "https://optimism-sepolia.blockscout.com",
      nativeCurrency: ethCurrency
    }
  },
  "oh": {
    title: "ORDAO Office Hours",
    contracts: {
      oldRespect: "0x53C9E3a44B08E7ECF3E8882996A500eb06c0C5CC",
      newRespect: "0xF6B17Fa1eD95F21E1eAdff6F96ce80E5a562D548",
      orec: "0xCD1fA63b85a708f039c4954af72E85CDd494B6cA"
    },
    ornodeUrl: "https://ordao-ornode.frapps.xyz",
    chainInfo: {
      chainId: "0xA",
      rpcUrls: [
          "https://mainnet.optimism.io/"
      ],
      chainName: "Optimism",
      blockExplorerUrl: "https://optimism.blockscout.com",
      nativeCurrency: ethCurrency
    }
  },
  "of2-candidate-1": {
    title: "Optimism Fractal candidate 1",
    contracts: {
      oldRespect: "0x53C9E3a44B08E7ECF3E8882996A500eb06c0C5CC",
      newRespect: "0xAA76B4397b0F79D5a16093c3040d8cf95951b9Ee",
      orec: "0x7Abe89De9172b3F8F122AA8756b0F9Ee989686b7"
    },
    ornodeUrl: "https://of2-ornode.frapps.xyz",
    chainInfo: {
      chainId: "0xA",
      rpcUrls: [
        "https://mainnet.optimism.io/"
      ],
      chainName: "Optimism",
      blockExplorerUrl: "https://optimism.blockscout.com",
      nativeCurrency: ethCurrency
    }
  }
} as const;

async function switchChain(
  chainInfo: ChainInfo,
  ethereum: Eip1193Provider
) {
  try {
    await ethereum // Or window.ethereum if you don't support EIP-6963.
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainInfo.chainId }],
      })
  } catch (err) {
    // This error code indicates that the chain has not been added to MetaMask.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof err === 'object' && (err as any)?.code === 4902) {
      await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainInfo.chainId,
              chainName: chainInfo.chainName,
              rpcUrls: chainInfo.rpcUrls,
              blockExplorerUrls: [chainInfo.blockExplorerUrl],
              nativeCurrency: chainInfo.nativeCurrency
            },
          ],
        })
    } else {
      throw err;
    }
  }
}

export type DeploymentSpec = DeploymentKey | DeploymentInfo;

export async function createOrclient(
  deployment: DeploymentSpec,
  provider: Eip1193Provider,
  orclientConfig?: Config 
): Promise<ORClient> {
  const depl = typeof deployment === 'string'
    ? deployments[deployment] : deployment;
  
  const ornode: RemoteOrnode = new RemoteOrnode(depl.ornodeUrl);

  await switchChain(depl.chainInfo, provider);

  const bp = new BrowserProvider(provider);
  const signer = await bp.getSigner();

  const ctxCfg: ORContext.ConfigWithOrnode = {
    orec: depl.contracts.orec,
    newRespect: depl.contracts.newRespect,
    ornode,
    contractRunner: signer
  }
  const ctx = await ORContext.ORContext.create<ORContext.ConfigWithOrnode>(ctxCfg);

  const orclient = new ORClient(ctx, orclientConfig);

  // If you want to be able to use through console
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).c = orclient;

  return orclient;
}

