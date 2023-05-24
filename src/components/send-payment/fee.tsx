import React, { ChangeEvent } from "react";
import { Button, Heading, Input } from "@stellar/design-system";
import { stroopToXlm } from "../../utils/format";

const BASE_FEE = "100";
const baseFeeXlm = stroopToXlm(BASE_FEE).toString();

interface FeeProps {
  onClick: () => void;
  tokenId: string;
}

export const Fee = (props: FeeProps) => {
  const [fee, setFee] = React.useState(baseFeeXlm);
  const handleFeeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFee(event.target.value);
  };
  const [memo, setMemo] = React.useState("");
  const handleMemoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  console.log(props.tokenId);

  return (
    <>
      <Heading as="h1" size="sm">
        Payment Settings
      </Heading>
      <Input
        fieldSize="md"
        id="input-fee"
        label="Estimated Fee"
        value={fee}
        onChange={handleFeeChange}
      />
      <Input
        fieldSize="md"
        id="input-memo"
        label="Memo"
        value={memo}
        onChange={handleMemoChange}
      />
      <div className="submit-row-fee">
        <Button
          size="md"
          variant="tertiary"
          isFullWidth
          onClick={props.onClick}
        >
          Next
        </Button>
      </div>
    </>
  );
};
