import { Config, getConnectorClient, getClient } from '@wagmi/core'
import { BrowserProvider, FallbackProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers'
import { defineChain, type Account, type Chain, type Client, type Transport } from 'viem'

export function clientToSigner(client: Client<Transport, Chain, Account>) {
    const { account, chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new BrowserProvider(transport, network)
    const signer = new JsonRpcSigner(provider, account.address)
    return signer
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner(
    config: Config,
    { chainId }: { chainId?: number } = {},
) {
    const client = await getConnectorClient(config, { chainId })
    return clientToSigner(client)
}

export function clientToProvider(client: Client<Transport, Chain>) {
    const { chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    if (transport.type === 'fallback') {
        const providers = (transport.transports as ReturnType<Transport>[]).map(
            ({ value }) => new JsonRpcProvider(value?.url, network),
        )
        if (providers.length === 1) return providers[0]
        return new FallbackProvider(providers)
    }
    return new JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function getEthersProvider(
    config: Config,
    { chainId }: { chainId?: number } = {},
) {
    const client = getClient(config, { chainId })
    if (!client) return
    return clientToProvider(client)
}

export const conduitPaytoMerchantRollup = defineChain({
    id: 1020,
    name: 'PaytoMerchantsRollup',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc-paytomerchants-co4xglkw0h.t.conduit.xyz'],
        webSocket: ['wss://rpc-paytomerchants-co4xglkw0h.t.conduit.xyz'],   
      },
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'https://explorer-paytomerchants-co4xglkw0h.t.conduit.xyz' },
    },
    contracts: {
    crosspayaddress: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 5882,
      },
    },
  })

export const modeSepolia = defineChain({
    id: 56,
    name: 'ModeSepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://sepolia.mode.network'],  
      },
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'https://explorer-modesepl-co4xglkw0h.t.conduit.xyz' },
    },
    contracts: {
        crosspayaddress: {
            address: '0x2AAC535db31DB35D13AECe36Ea7954A2089D55bE',
            blockCreated: 5882,
        },
    },
  })

export const fraxtaltestnet = defineChain({
    id: 2522,
    name: 'FraxtalTestnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.testnet.frax.com'], 
      },
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'https://holesky.fraxscan.com/' },
    },
    contracts: {
        crosspayaddress: {
            address: '0x301Ab38c7f652FA23C7Ba1fa182E36665Dac0fC2',
            blockCreated: 5882,
        },
    },
  })