import React, { ChangeEvent } from "react";
import { Button, Heading, Input } from "@stellar/design-system";

interface SendAmountProps {
  amount: string;
  balance: string;
  setAmount: (amount: string) => void;
  onClick: () => void;
}

export const SendAmount = (props: SendAmountProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.setAmount(event.target.value);
  };

  return (
    <>
      <Heading as="h1" size="sm">
        Available Balance
      </Heading>
      <Heading size="md" as="h2">
        {props.balance}
      </Heading>
      <Input
        fieldSize="md"
        id="input-amount"
        label="Choose amount to send"
        value={props.amount}
        onChange={handleChange}
      />
      <div className="submit-row">
        <Button
          size="md"
          variant="tertiary"
          isFullWidth
          onClick={props.onClick}
          disabled={props.amount.length < 1}
        >
          Next
        </Button>
      </div>
    </>
  );
};
