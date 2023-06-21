import React from "react";
import { Button, Heading, Select } from "@stellar/design-system";

interface ConnectWalletProps {
  selectedNetwork: string;
  pubKey: string | null;
  onClick: () => void;
}

export const ConnectWallet = (props: ConnectWalletProps) => {
  const text = props.pubKey ? "Next" : "Connect Freighter";
  return (
    <>
      <Heading as="h1" size="sm">
        Send a Soroban Payment
      </Heading>
      <Select
        disabled
        fieldSize="md"
        id="selected-network"
        label="Select your Network"
        value={props.selectedNetwork}
      >
        <option>{props.selectedNetwork}</option>
      </Select>
      <div className="submit-row">
        <Button
          size="md"
          variant="tertiary"
          isFullWidth
          onClick={props.onClick}
        >
          {text}
        </Button>
      </div>
    </>
  );
};
