import React from "react"
import { Select } from "@stellar/design-system"

import { Networks } from "utils"

// Can enable this once Soroban is on more networks
const NETWORKS_DISABLED = true

interface SelectNetworkProps {
  selectedNetwork: string
}

function SelectNetwork(props: SelectNetworkProps) {

  return (
    <Select
      fieldSize="md"
      id="select-network"
      label="Select your network"
      disabled={NETWORKS_DISABLED}
      value={props.selectedNetwork}
    >
      {Object.keys(Networks).map(network => (
        <option key={network}>
          {network}
        </option>
      ))}
    </Select>
  )
}

export { SelectNetwork }