"use client"

import * as React from "react"
import Image from "next/image"
import { assetsMap } from "@/constants/Assets"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import SelectMultipleToken from "./SelectMultipleToken"
import SelectToken from "./SelectToken"
import { Separator } from "../ui/separator"
import { EASContractAddress, SchemaType, SchemaUID } from "@/constants/schemaDetails"
import { getEthersSigner } from "@/utils/eas-wagmi-utils"
import { config } from "@/utils/config"
import { toast } from "../ui/use-toast"
import Link from "next/link"
import { ExternalLink } from 'lucide-react';

const CreateAttestation = () => {
  const FormSchema = z.object({
    merchant_name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    shop_name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    merchant_registered_number: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    primary_wallet_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Invalid Ethereum address.",
    }),
    primary_asset: z.object({
      address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address.",
      }),
      symbol: z.string().min(2, {
        message: "Must be at least 2 characters.",
      }),
    }),
    wallet_addresses: z.array(
      z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address.",
      })
    ),
    assets: z.array(
      z.object({
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
          message: "Invalid Ethereum address.",
        }),
        symbol: z.string().min(2, {
          message: "Must be at least 2 characters.",
        }),
      })
    ),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      merchant_name: "",
      shop_name: "",
      merchant_registered_number: '',
      primary_wallet_address: "",
      primary_asset: {
        address: "",
        symbol: "",
      },
      wallet_addresses: [],
      assets: [],
    },
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted!");
    console.log("Data:", data);
    handleCreateAttestation(data)
  }

  const primaryAsset = useWatch({
    control: form.control,
    name: "primary_asset",
  })

  const handleSelectedToken = (assetName: string) => {

    const asset = assetsMap[assetName]

    form.setValue("primary_asset", {
      address: asset.address,
      symbol: asset.name,
    })
  }

  const [addresses, setAddresses] = React.useState([""])

  const handleAddAddress = () => {
    console.log("Adding address >>>", addresses)
    setAddresses([...addresses, ""])
  }

  const handleRemoveAddress = (index: number) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
    const newWalletAddresses = [...form.getValues("wallet_addresses")];
    newWalletAddresses.splice(index, 1);
    form.setValue("wallet_addresses", newWalletAddresses);
  };

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
    const newWalletAddresses = [...form.getValues("wallet_addresses")];
    newWalletAddresses[index] = value;
    form.setValue("wallet_addresses", newWalletAddresses);
  };

  const schemaEncoder = new SchemaEncoder(SchemaType)

  const [isLoading, setIsLoading] = React.useState(false);
  const [attestationUID, setAttestationUID] = React.useState('');

  const handleCreateAttestation = async (data: z.infer<typeof FormSchema>) => {
    const eas = new EAS(EASContractAddress)
    try {
      setIsLoading(true)
      const signer = await getEthersSigner(config)
      await eas.connect(signer)
      console.log("Signer after >>>>", signer);

      const merchantData = [
        {
          name: "merchant_name",
          value: data.merchant_name,
          type: "string",
        },
        {
          name: "shop_name",
          value: data.shop_name,
          type: "string",
        },
        {
          name: "merchant_registered_number",
          value: data.merchant_registered_number,
          type: "uint40",
        }
      ];

      const primaryWallets = [
        {
          name: "primary_wallet_address",
          value: data.primary_wallet_address,
          type: "address",
        },
        {
          name: "primary_asset_address",
          value: data.primary_asset.address,
          type: "address",
        },
        {
          name: "primary_asset_symbol",
          value: data.primary_asset.symbol,
          type: "string",
        }
      ]

      const walletAddresses = [
        {
          name: 'wallet_addresses',
          value: data.wallet_addresses,
          type: 'address[]'
        }
      ]
      const assetAddresses = [
        {
          name: "asset_addresses",
          value: data.assets.map((asset) => asset.address),
          type: "address[]",
        },
      ]

      const assetsSymbol = [
        {
          name: "assets_symbol",
          value: data.assets.map((asset) => asset.symbol),
          type: "string[]",
        },
      ]

      const encodedData = schemaEncoder.encodeData([
        ...merchantData,
        ...primaryWallets,
        ...walletAddresses,
        ...assetAddresses,
        ...assetsSymbol
      ])

      console.log("Encoded Data >>", encodedData, signer.address);

      const tx = await eas.attest({
        schema: SchemaUID,
        data: {
          recipient: signer.address, // recipient is the primary wallet address
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      })

      console.log("Transaction >>>", tx)
      const newAttestationUID = await tx.wait()
      console.log("New attestation UID:", newAttestationUID)
      setAttestationUID(newAttestationUID)
      setIsLoading(false)
      toast({
        title: 'Success',
        description: 'Attestation created successfully',
      })

    } catch (error: any) {
      setIsLoading(false)
      console.log("Error >>>>", error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: error.message,
      })
    }

  }

  return (
    <div className="w-full px-10">
      <Card>
        <CardHeader>
          <CardTitle className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Configure Merchant Preferences
          </CardTitle>
          <CardDescription>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Configure your details and create attestations.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-8"
            >

              <div className="flex flex-row gap-12">
                <div className="w-full">
                  <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Merchant Details
                  </h2>
                  <div className="mt-8 flex flex-col gap-8">
                    <FormField
                      control={form.control}
                      name="merchant_name"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Merchant Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="shop_name"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Shop Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Shop Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="merchant_registered_number"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Registered Number</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                </div>

                <Separator orientation='vertical' className=" min-h-[450px]" />


                <div className="w-full">
                  <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Wallet Addresses Details
                  </h2>
                  <div className="mt-8 flex flex-col gap-8">
                    <FormField
                      control={form.control}
                      name="primary_wallet_address"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Primary Wallet Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your primary wallet address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="primary_asset"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Primary Token</FormLabel>
                            <FormControl>
                              <SelectToken onSelect={handleSelectedToken} />
                            </FormControl>
                            <FormDescription>Select primary token in which you want to receive</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                </div>

                <Separator orientation='vertical' className=" min-h-[450px]" />

                <div className="w-full">
                  <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Optional Details
                  </h2>
                  <div className="mt-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <Label>Token Preferences</Label>
                      <Controller
                        control={form.control}
                        name="assets"
                        render={({ field }) => {
                          const onChange = field.onChange
                          return (
                            <SelectMultipleToken
                              onChange={(values: any[]) => {
                                const selectedAssets = values.map((value) => ({
                                  address: value.value.address,
                                  symbol: value.value.name,
                                }));
                                console.log("Selected address", selectedAssets);
                                onChange(selectedAssets);
                              }}
                            />
                          )
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <Label>Wallet Addresses:</Label>
                      {addresses.map((address, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            value={address}
                            onChange={(e) => handleAddressChange(index, e.target.value)}
                            placeholder="Enter wallet address"
                          />
                          {addresses.length > 1 && (
                            <Button onClick={() => handleRemoveAddress(index)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button onClick={(e) => {
                        e.preventDefault()
                        handleAddAddress()
                      }}>Add Address</Button>
                    </div>
                  </div>
                </div>
              </div>


              <Button
                disabled={isLoading}
                onClick={form.handleSubmit(onSubmit)}>
                {isLoading ? 'Submitting....' : 'Submit'}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>


      {attestationUID && <div className="flex gap-4">
        <p>Attestation Created:</p>
        <p>
          {attestationUID}
        </p>
        <Link target="_blank" href={`https://sepolia.easscan.org/attestation/view/${attestationUID}`}>
          <ExternalLink />
        </Link>
      </div>}

    </div>
  )
}

export { CreateAttestation }
