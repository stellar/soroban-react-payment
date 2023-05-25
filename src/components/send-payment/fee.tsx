import React, { ChangeEvent, useEffect } from "react";
import { Button, Heading, Input } from "@stellar/design-system";
import { getTokenSymbol, getTxBuilder } from "utils/soroban";
import { NetworkDetails } from "utils/network";
import { stroopToXlm, xlmToStroop } from "../../utils/format";

const BASE_FEE = "100";
const baseFeeXlm = stroopToXlm(BASE_FEE).toString();

interface FeeProps {
  onClick: () => void;
  pubKey: string;
  networkDetails: NetworkDetails;
  tokenId: string;
}

export const Fee = (props: FeeProps) => {
  const [tokenSymbol, setTokenSymbol] = React.useState("");
  const [fee, setFee] = React.useState(baseFeeXlm);
  const handleFeeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFee(event.target.value);
  };
  const [memo, setMemo] = React.useState("");
  const handleMemoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  useEffect(() => {
    (async () => {
      const txBuilder = getTxBuilder(
        props.pubKey,
        xlmToStroop(fee).toString(),
        props.networkDetails.networkPassphrase,
      );
      const symbol = await getTokenSymbol(
        props.tokenId,
        txBuilder,
        props.networkDetails,
      );
      console.log(symbol);
      setTokenSymbol(symbol);
    })();
  }, [
    props.tokenId,
    props.pubKey,
    props.networkDetails.networkPassphrase,
    props.networkDetails,
    fee,
  ]);

  console.log(tokenSymbol);

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
