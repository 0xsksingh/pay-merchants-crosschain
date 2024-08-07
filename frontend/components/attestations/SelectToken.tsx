import React from "react"
import Image from "next/image"
import { assetsMap } from "@/constants/Assets"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SelectToken = ({
  onSelect,
}: {
  onSelect: (assetName: string) => void
}) => {
  const options = []
  for (const [assetName, asset] of Object.entries(assetsMap)) {
    options.push(
      <SelectItem key={asset.id} value={assetName}>
        <div className="flex flex-row gap-4">
          <Image src={asset.symbol} alt={asset.name} width={20} height={20} />
          <div>{asset.name}</div>
        </div>
      </SelectItem>
    )
  }

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select token" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Assets</SelectLabel>
          {options}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectToken
