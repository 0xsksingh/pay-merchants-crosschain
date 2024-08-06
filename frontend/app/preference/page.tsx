"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"
import { crosspayABI } from "@/abi/crosspayABI"
import { createPublicClient, createWalletClient, custom, http } from "viem"
import { mainnet, polygon } from "viem/chains"
import * as chains from "viem/chains"

import { siteConfig } from "@/config/site"
import TabSet from "@/components/TabSet"

const CHAINS: Record<number, chains.Chain> = {
  [137]: chains.polygon,
  [1]: chains.mainnet,
  [84531]: chains.baseGoerli,
}

type AsyncFunction<TArgs extends any[], TResult> = (
  ...args: TArgs
) => Promise<TResult>

function memoizeAsync<TArgs extends any[], TResult>(
  fn: AsyncFunction<TArgs, TResult>
): AsyncFunction<TArgs, TResult> {
  const cache = new Map<string, Promise<TResult>>()

  return async (...args: TArgs): Promise<TResult> => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return (await cache.get(key))!
    }

    const resultPromise = fn(...args)
    cache.set(key, resultPromise)
    return await resultPromise
  }
}

const Merchantpreference: React.FC = () => {
  const [jsonInput, setJsonInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [primaryAddress, setPrimaryAddress] = useState("")
  const [preferredAssets, setPreferredAssets] = useState([
    { chain: "ethereum", address: "", symbol: "ETH" },
  ])
  const [addresses, setAddresses] = useState([""])

  const getChainDetails = memoizeAsync(async function () {
    const walletClient = createWalletClient({
      transport: custom((window as any).ethereum),
    })

    const chainId = await walletClient.getChainId()

    const chain = CHAINS[chainId]

    // const publicClient = () =>
    //   configureChains([chain], [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID! })]).publicClient({ chainId: chainId })

    const publicClient = createPublicClient({
      chain,
      transport: http(
        `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID}`
      ),
    })

    const contractAddress = (
      siteConfig.crosspayaddress as Record<number, `0x${string}`>
    )[chainId]
    if (!contractAddress) {
      toast.error("Contract not deployed on this network")
    }

    const [address] = await walletClient.getAddresses()

    return {
      walletClient,
      chainId,
      chain,
      publicClient,
      contractAddress,
      address,
    }
  })

  useEffect(() => {
    ;(async function () {
      const {
        walletClient,
        chainId,
        chain,
        publicClient,
        contractAddress,
        address,
      } = await getChainDetails()

      const response = await axios.get("/api/checkwallet", {
        params: {
          userAddress: address,
        },
      })
      if (response.data && (JSON.parse(response.data.data) as any).timestamp) {
        const jsonData = JSON.parse(response.data.data)
        jsonData.timestamp = new Date().toISOString()
        setJsonInput(JSON.stringify(jsonData, null, 2))
        setPrimaryAddress(jsonData.primaryAddress)
        setPreferredAssets(jsonData.preferredAssets)
        setAddresses(jsonData.addresses)
      } else {
        setJsonInput(
          JSON.stringify(
            {
              timestamp: new Date().toISOString(),
              primaryAddress: address,
              preferredAssets: [
                { chain: "ethereum", address: address, symbol: "ETH" },
              ],
              addresses: [address],
            },
            null,
            2
          )
        )
        setPrimaryAddress(address)
        setPreferredAssets([
          { chain: "ethereum", address: address, symbol: "ETH" },
        ])
        setAddresses([address])
      }
    })()
  }, [])

  const getData = () => {
    try {
      return JSON.parse(jsonInput)
    } catch (error) {
      toast.error("Invalid JSON")
      return null
    }
  }

  async function updateOnChainPointer(cid: string) {
    const {
      walletClient,
      chainId,
      chain,
      publicClient,
      contractAddress,
      address,
    } = await getChainDetails()
    const txnHash = await walletClient.writeContract({
      account: address,
      address: contractAddress,
      abi: crosspayABI,
      chain: chain,
      functionName: "setPointer",
      args: ["ipfs:" + cid],
    })
    toast.info(`Generated transaction, waiting for success...`)
    while (true) {
      try {
        await publicClient.waitForTransactionReceipt({ hash: txnHash })
        break
      } catch (error) {
        // async sleep 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }
    return { txnHash }
  }

  const saveData = async (data: any) => {
    const { chain } = await getChainDetails()
    try {
      setIsLoading(true)
      const response = await axios.post("/api/store", {
        data: JSON.stringify(data, null, 2),
      })
      toast.info(`Successfully stored to IPFS: ${response.data.cid}`)
      const res = await updateOnChainPointer(response.data.cid)
      if (!res) {
        toast.error("Error putting pointer on chain")
      } else {
        const { txnHash } = res
        toast.success(
          <>
            <a
              target="_blank"
              rel="noreferrer"
              href={chain.blockExplorers!.default.url + "/tx/" + txnHash}
            >
              Successfully updated on-chain pointer. Txn: {txnHash}
            </a>
          </>
        )
      }
    } catch (error) {
      toast.error("Error storing data")
      console.log(error)
      console.log((error as any).stack)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    const data = {
      timestamp: new Date().toISOString(),
      primaryAddress,
      preferredAssets,
      addresses,
    }
    setJsonInput(JSON.stringify(data, null, 2))
    saveData(data)
  }

  const handlePreferredAssetChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newAssets = [...preferredAssets]
    newAssets[index] = { ...newAssets[index], [field]: value }
    setPreferredAssets(newAssets)
  }

  const handleAddPreferredAsset = () => {
    setPreferredAssets([
      ...preferredAssets,
      { chain: "", address: "", symbol: "" },
    ])
  }

  const handleRemovePreferredAsset = (index: number) => {
    const newAssets = [...preferredAssets]
    newAssets.splice(index, 1)
    setPreferredAssets(newAssets)
  }

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...addresses]
    newAddresses[index] = value
    setAddresses(newAddresses)
  }

  const handleAddAddress = () => {
    console.log("Adding address >>>", addresses)

    setAddresses([...addresses, ""])
  }

  const handleRemoveAddress = (index: number) => {
    const newAddresses = [...addresses]
    newAddresses.splice(index, 1)
    setAddresses(newAddresses)
  }

  return (
    <>
      <TabSet />
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">
          Configure Merchant Preferences
        </h1>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">
            Primary Address
          </label>
          <input
            className="mb-4 w-full rounded border p-2"
            value={primaryAddress}
            onChange={(e) => setPrimaryAddress(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">
            Preferred Assets
          </label>
          {preferredAssets.map((asset, index) => (
            <div key={index} className="mb-2 flex space-x-2">
              <input
                className="w-full rounded border p-2"
                placeholder="Chain"
                value={asset.chain}
                onChange={(e) =>
                  handlePreferredAssetChange(index, "chain", e.target.value)
                }
              />
              <input
                className="w-full rounded border p-2"
                placeholder="Address"
                value={asset.address}
                onChange={(e) =>
                  handlePreferredAssetChange(index, "address", e.target.value)
                }
              />
              <input
                className="w-full rounded border p-2"
                placeholder="Symbol"
                value={asset.symbol}
                onChange={(e) =>
                  handlePreferredAssetChange(index, "symbol", e.target.value)
                }
              />
              <button
                className="rounded bg-red-500 px-4 py-2 text-white"
                onClick={() => handleRemovePreferredAsset(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="rounded bg-green-500 px-4 py-2 text-white"
            onClick={handleAddPreferredAsset}
          >
            Add Asset
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Addresses</label>
          {addresses.map((address, index) => (
            <div key={index} className="mb-2 flex space-x-2">
              <input
                className="w-full rounded border p-2"
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
              />
              <button
                className="rounded bg-red-500 px-4 py-2 text-white"
                onClick={() => handleRemoveAddress(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="rounded bg-green-500 px-4 py-2 text-white"
            onClick={handleAddAddress}
          >
            Add Address
          </button>
        </div>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save merchant payment preferences"}
        </button>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  )
}

export default Merchantpreference
