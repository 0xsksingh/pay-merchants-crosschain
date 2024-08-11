"use client"

import React, { useEffect, useState } from "react"
import TabSet from "components/TabSet"
import { ToastContainer, toast } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { BrowserProvider, ethers } from "ethers"
import {
  ERC20_ABI,
  SPOKEPOOL_ABI,
  TOKEN_ADDRESS_BY_SYMBOL,
  ZKBOB_DIRECT_DEPOSIT_ABI,
} from "misc"
import { createPublicClient, createWalletClient, custom, http } from "viem"
import * as chains from "viem/chains"


type AssetType = "WETH" | "SDAI" | "BTC" | "USDC" | "USDT"

interface TransactionStatus {
  status: "success" | "fail" | "unknown"
  error?: string
  suggestion?: {
    description: string
    actionText: string
    actionFunction: () => void
  }
}

const CHAINS: Record<number, chains.Chain> = {
  [137]: chains.polygon,
  [1]: chains.mainnet,
  [100]: chains.gnosis,
  [919] : chains.modeTestnet,
}

const chainIdByName: Record<string, number> = {
  ethereum: 1,
  polygon: 137,
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

export default function Home() {
  const [paymentDestinationAddress, setPaymentDestinationAddress] = useState("")
  const [paymentAsset, setPaymentAsset] = useState<AssetType>("WETH")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus | null>(null)
  const [isCheckLoading, setIsCheckLoading] = useState(false)
  const [isTxnLoading, setIsTxnLoading] = useState(false)

  const getChainDetails = memoizeAsync(async function () {
    const walletClient = createWalletClient({
      transport: custom((window as any).ethereum),
    })

    const chainId = await walletClient.getChainId()

    const chain = CHAINS[chainId]

    // const publicClient = () =>
    //   configureChains([chain], [alchemyProvider({ apiKey: 'wFen0yW-EwjPyr49Cyg2x2nNARSt7Os0' })]).publicClient({ chainId: chainId })

    const publicClient = createPublicClient({
      chain,
      transport: http(
        `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID}`
      ),
    })

    const [address] = await walletClient.getAddresses()

    return { walletClient, chainId, chain, address, publicClient }
  })

  useEffect(() => {
    setTransactionStatus(null)
  }, [paymentDestinationAddress, paymentAsset, paymentAmount])

  async function approve(tokenAddress: string, spender: string) {
    toast.info("Approving token transfer...")
    let txnHash
    const writeContractArgs = {
      account: (await getChainDetails()).address,
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      chain: CHAINS[await (await getChainDetails()).walletClient.getChainId()],
      // @ts-ignore
      functionName: "approve",
      args: [spender, 10000000000000000000000],
    }
    console.log("writeContractArgs", writeContractArgs)
    try {
      txnHash = await (
        await getChainDetails()
      ).walletClient.writeContract(writeContractArgs)
    } catch (error) {
      console.log(error)
      console.log((error as any).trace)
      toast.error("Failed to submit approval transaction")
    }
    toast.info("Approval transaction sent, waiting for success...")
    while (true) {
      try {
        txnHash = await (await getChainDetails()).walletClient.writeContract(writeContractArgs)
      } catch (error) {
        // async sleep 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }
    toast.success("Approval transaction successful")
  }

  async function send(
    tokenAddress: string,
    recipient: string,
    amount: string | number
  ) {
    toast.info("Sending tokens...")
    let txnHash
    const writeContractArgs = {
      account: (await getChainDetails()).address,
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      chain: CHAINS[await (await getChainDetails()).walletClient.getChainId()],
      // @ts-ignore
      functionName: "transfer",
      args: [recipient, amount.toString()],
    }
    console.log("writeContractArgs", writeContractArgs)
    try {
      txnHash = await (
        await getChainDetails()
      ).walletClient.writeContract(writeContractArgs)
    } catch (error) {
      console.log(error)
      console.log((error as any).trace)
      toast.error("Failed to submit send transaction")
    }
    toast.info("Transaction sent, waiting for success...")
    while (true) {
      try {
        txnHash = await (await getChainDetails()).walletClient.writeContract(writeContractArgs)
      }  catch (error) {
        // async sleep 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }
    toast.success("Tokens sent successfully")
  }

  const checkValidity = async () => {
    ;(async function () {
      setIsCheckLoading(true)
      let status: TransactionStatus | null = null

      const response = await axios.get("/api/checkwallet", {
        params: {
          userAddress: paymentDestinationAddress,
        },
      })
      if (response.data && (JSON.parse(response.data.data) as any).timestamp) {
        const recipientData = JSON.parse(response.data.data)

        for (const preferredAsset of recipientData.preferredAssets) {
          if (
            preferredAsset.chain ==
            (await getChainDetails()).chain.name.toLowerCase()
          ) {
            console.log("correct chain")
            if (preferredAsset.symbol === paymentAsset) {
              console.log("correct chain, correct asset")
              if (preferredAsset.address === paymentDestinationAddress) {
                console.log("correct chain, correct asset, correct address")

                status = {
                  status: "success",
                  suggestion: {
                    description: "Transaction is valid",
                    actionText: "Send",
                    actionFunction: async function () {
                      await send(
                        TOKEN_ADDRESS_BY_SYMBOL[paymentAsset][
                          (await getChainDetails()).chain.name.toLowerCase()
                        ],
                        paymentDestinationAddress,
                        paymentAmount
                      )
                    },
                  },
                }
              } else {
                console.log("incorrect address")
                status = {
                  status: "fail",
                  error: `User requests asset sent to a different address: ${preferredAsset.address}`,
                  suggestion: {
                    description: "Send to preferred address",
                    actionText: "Update address and send",
                    actionFunction: async function () {
                      await send(
                        TOKEN_ADDRESS_BY_SYMBOL[paymentAsset][
                          (await getChainDetails()).chain.name.toLowerCase()
                        ],
                        preferredAsset.address,
                        paymentAmount
                      )
                    },
                  },
                }
              }
            } else {
              console.log("correct chain, incorrect asset")
              console.log("need to swap")
              status = {
                status: "fail",
                error:
                  "Incorrect asset, the recipient prefers " +
                  preferredAsset.symbol,
                suggestion: {
                  description: `To complete this transaction, swap ${paymentAsset} to ${preferredAsset.symbol}`,
                  actionText: "Swap and send",
                  actionFunction: async () => {
                    await approve(
                      TOKEN_ADDRESS_BY_SYMBOL[paymentAsset][
                        (await getChainDetails()).chain.name.toLowerCase()
                      ],
                      "0x1111111254eeb25477b68fb85ed929f73a960582"
                    )
                    const caller = (await getChainDetails()).address
                    const swapFromTokenAddress =
                      TOKEN_ADDRESS_BY_SYMBOL[paymentAsset][
                        (await getChainDetails()).chain.name.toLowerCase()
                      ]
                    const swapToTokenAddress =
                      TOKEN_ADDRESS_BY_SYMBOL[preferredAsset.symbol][
                        (await getChainDetails()).chain.name.toLowerCase()
                      ]
                    const swapAmount = ethers
                      .parseUnits(paymentAmount, 1)
                      .toString()
                    const url = `https://api.1inch.io/v5.2/1/swap?src=${swapFromTokenAddress}&dst=${swapToTokenAddress}&amount=${swapAmount}&from=${caller}&slippage=1&disableEstimate=false&includeTokensInfo=true&includeProtocols=true&compatibility=true&allowPartialFill=false`
                    let response
                    try {
                      response = await axios.get(url)
                    } catch (error) {
                      toast.error("failed to generate swap")
                      return
                    }
                    console.log(response.data)
                    const swapData = response.data.tx
                    const walletClient = (await getChainDetails()).walletClient
                    const sendForSwap = {
                      // chain: await walletClient.getChainId(),
                      // account: (await getChainDetails()).address,
                      from: swapData.from,
                      to: swapData.to,
                      data: swapData.data,
                      value: swapData.value,
                    }
                    console.log(sendForSwap)
                    // let txnHash = await walletClient.sendTransaction(sendForSwap)
                    // send txn using ethers
                    const provider = new BrowserProvider(
                      (window as any).ethereum
                    )
                    const signer = provider.getSigner()
                    let txn
                    try {
                      // todo fix this error 
                      // @ts-ignore
                      txn = await signer.sendTransaction(sendForSwap)
                    } catch (error) {
                      toast.error("failed to generate swap")
                      return
                    }
                    let txnHash = txn.hash as `0x${string}`

                    toast.info(
                      `Generated swap transaction, waiting for success...`
                    )
                    while (true) {
                      try {
                        // @ts-ignore
                        await (await getChainDetails()).publicClient().waitForTransactionReceipt({ hash: txnHash })
                        break
                      } catch (error) {
                        // async sleep 3 seconds
                        await new Promise((resolve) => setTimeout(resolve, 3000))
                      }
                    }
                    toast.success("Swap transaction successful")

                    send(
                      swapToTokenAddress,
                      paymentDestinationAddress,
                      swapAmount
                    )
                  },
                },
              }
            }
          } else {
              console.log("incorrect chain -- need to bridge")
              status = {
                status: "fail",
                error:
                  "The asset is on the wrong chain, the recipient prefers " +
                  preferredAsset.chain,
                suggestion: {
                  description: `To complete this transaction, bridge from ${(
                    await getChainDetails()
                  ).chain.name.toLowerCase()} to ${preferredAsset.chain}`,
                  actionText: "Bridge and send",

                  actionFunction: async () => {
                    const acrossBridgeAddress =
                      (await getChainDetails()).chain.name.toLowerCase() ==
                      "polygon"
                        ? "0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"
                        : "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
                    await approve(
                      TOKEN_ADDRESS_BY_SYMBOL[paymentAsset][
                        (await getChainDetails()).chain.name.toLowerCase()
                      ],
                      acrossBridgeAddress
                    )
                    let txnHash
                    try {
                      txnHash = await (
                        await getChainDetails()
                      ).walletClient.writeContract({
                        account: (await getChainDetails()).address,
                        address: acrossBridgeAddress, // across bridge
                        abi: SPOKEPOOL_ABI,
                        chain:
                          CHAINS[
                            await (
                              await getChainDetails()
                            ).walletClient.getChainId()
                          ],
                        // @ts-ignore
                        functionName: "deposit",
                        args: [
                          // recipient address
                          paymentDestinationAddress,
                          // originToken
                          TOKEN_ADDRESS_BY_SYMBOL[paymentAsset][
                            (await getChainDetails()).chain.name.toLowerCase()
                          ],
                          // amount
                          ethers.parseUnits(paymentAmount, 1).toString(),
                          // destinationChainId
                          chainIdByName[preferredAsset.chain],
                          //relayerFeePct
                          1,
                          // quoteTimestamp
                          Math.floor(Date.now() / 1000),
                          // message
                          "0x",
                          // maxCount
                          "115792089237316195423570985008687907853269984665640564039457584007913129639935",
                        ],
                      })
                    } catch (error) {
                      toast.error("Failed to submit bridge transaction")
                      return
                    }
                    toast.info(
                      `Generated bridge transaction, waiting for success...`
                    )
                    while (true) {
                      try {
                        // @ts-ignore
                        await (await getChainDetails()).publicClient().waitForTransactionReceipt({ hash: txnHash })
                        break
                      } catch (error) {
                        // async sleep 3 seconds
                        await new Promise((resolve) =>
                          setTimeout(resolve, 3000)
                        )
                      }
                    }
                    toast.success("Bridge transaction successful")
                  },
                },
              }
            }
          }

        }
      else {
        status = {
          status: "unknown",
          suggestion: {
            description:
              "No preferences found for this user, use caution when sending",
            actionText: "Send",
            actionFunction: async function () {
              await send(
                TOKEN_ADDRESS_BY_SYMBOL[paymentAsset][
                  (await getChainDetails()).chain.name.toLowerCase()
                ],
                paymentDestinationAddress,
                paymentAmount
              )
            },
          },
        }
      }

      if (status) {
        setTransactionStatus(status)
      } else {
        alert("unknown error")
      }

      setIsCheckLoading(false)
    })()
  }

  return (
    <>
      <TabSet />
      <div className="mx-auto my-8 max-w-md rounded-lg bg-white p-4 shadow-lg">
        <input
          className="mb-2 w-full rounded border p-2"
          type="text"
          placeholder="Address"
          value={paymentDestinationAddress}
          onChange={(e) => setPaymentDestinationAddress(e.target.value)}
        />
        <div className="mb-2 flex space-x-2">
          <select
            className="w-1/2 rounded border p-2"
            value={paymentAsset}
            onChange={(e) => setPaymentAsset(e.target.value as AssetType)}
          >
            <option value="WETH">WETH</option>
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
          </select>
          <input
            className="w-1/2 rounded border p-2"
            type="number"
            placeholder="Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
        </div>

        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={checkValidity}
        >
          {isCheckLoading ? "Loading..." : "Check transaction validity"}
        </button>

        {transactionStatus && (
          <div className="mt-4">
            {transactionStatus.error && (
              <p className="text-red-500">{transactionStatus.error}</p>
            )}
            {transactionStatus.suggestion && (
              <div className="mt-2">
                <p>{transactionStatus.suggestion.description}</p>
                <button
                  className="my-1 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                  onClick={async function () {
                    setIsTxnLoading(true)
                    await transactionStatus.suggestion!.actionFunction()
                    setIsTxnLoading(false)
                  }}
                >
                  {isTxnLoading
                    ? "Loading..."
                    : transactionStatus.suggestion.actionText}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
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
    </>
  )
}
