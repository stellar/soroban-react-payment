import React from "react";
import { Button, Heading } from "@stellar/design-system";

interface ConnectWalletProps {
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
