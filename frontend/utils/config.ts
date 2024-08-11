import { http } from 'wagmi'
import { baseSepolia, mainnet, modeTestnet, sepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

const chains = [mainnet, sepolia , modeTestnet , baseSepolia] as const

const metadata = {
    name: 'EAS Attestation',
    description: 'AppKit Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = defaultWagmiConfig({
    chains,
    projectId: 'ebc8b79c899ea9b36db43c39aea67728',
    metadata,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [modeTestnet.id]: http(),
        [baseSepolia.id]: http(),
    },
})