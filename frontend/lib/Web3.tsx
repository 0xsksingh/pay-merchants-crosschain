"use client"

import { ReactNode, useEffect, useState } from "react"
import { config } from "@/utils/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { WagmiProvider } from "wagmi"

interface Props {
  children: ReactNode
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "ebc8b79c899ea9b36db43c39aea67728"

export function Web3Provider(props: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  const queryClient = new QueryClient()

  const metadata = {
    name: "EAS Attestation",
    description: "AppKit Example",
    url: "https://web3modal.com", // origin must match your domain & subdomain
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  }

  createWeb3Modal({
    metadata,
    wagmiConfig: config,
    projectId,
    enableAnalytics: true,
  })

  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </>
  )
}
