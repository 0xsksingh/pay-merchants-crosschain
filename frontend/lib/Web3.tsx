"use client"
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig, mainnet, sepolia, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { useColorMode } from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'
import { Web3Modal } from '@web3modal/react'
import { optimism, polygon } from 'viem/chains'

interface Props {
  children: ReactNode
}

const ETH_CHAINS = [mainnet, sepolia, polygon, optimism]


const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

if (!projectId) {
  console.warn('Please provide a walletconnect env variable')
}
const { chains, publicClient, webSocketPublicClient } = configureChains(ETH_CHAINS, [publicProvider(), w3mProvider({ projectId: projectId })])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({  chains, projectId: projectId }),
  publicClient,
  webSocketPublicClient,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

export function Web3Provider(props: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <>
      {ready && <WagmiConfig config={wagmiConfig}>{props.children}</WagmiConfig>}

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  )
}
