import React from "react"

import MultipleSelector from "../ui/multiple-selector"
import { assetsMap } from "@/constants/Assets"

const SelectMultipleToken = ({ onChange } : any) => {

  const OPTIONS: any[] = Object.keys(assetsMap).map((key) => ({
    label: key,
    value: assetsMap[key],
  }));


  return (
    <div className="flex w-full flex-col gap-5">
      <MultipleSelector
        onChange={onChange}
        defaultOptions={OPTIONS}
        placeholder="Select your payment tokens..."
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  )
}

export default SelectMultipleToken
