import React from "react";
import { Button, Heading } from "@stellar/design-system";
import { truncateString } from "helpers/format";
import { NetworkDetails, signTx } from "helpers/network";
import { makePayment, getTxBuilder, parseTokenAmount } from "helpers/soroban";
import { IdenticonImg } from "components/identicon";

interface ConfirmPaymentProps {
  amount: string;
  destination: string;
  fee: string;
  pubKey: string;
  memo: string;
  network: string;
  onTxSign: (xdr: string) => void;
  tokenId: string;
  tokenDecimals: number;
  tokenSymbol: string;
  networkDetails: NetworkDetails;
}

export const ConfirmPayment = (props: ConfirmPaymentProps) => {
  const signWithFreighter = async () => {
    const amount = parseTokenAmount(props.amount, props.tokenDecimals);
    const builder = await getTxBuilder(
      props.pubKey,
      props.fee,
      props.networkDetails,
    );
    const xdr = await makePayment(
      props.tokenId,
      amount.toNumber(),
      props.destination,
      props.pubKey,
      builder,
      props.networkDetails,
    );
    const options = {
      network: props.networkDetails.network,
      networkPassphrase: props.networkDetails.networkPassphrase,
      accountToSign: props.pubKey,
    };
    const signedTx = await signTx(xdr, options);
    props.onTxSign(signedTx);
  };
  return (
    <>
      <Heading as="h1" size="sm">
        Confirm Payment
      </Heading>
      <div className="tx-details">
        <div className="tx-detail-item">
          <p className="detail-header">Network</p>
          <p>{props.network}</p>
        </div>
        <div className="tx-detail-item">
          <p className="detail-header">To</p>
          <div className="dest-identicon">
            <p>{truncateString(props.destination)}</p>
            <IdenticonImg publicKey={props.pubKey} />
          </div>
        </div>
        <div className="tx-detail-item">
          <p className="detail-header">Amount</p>
          <p>
            {props.amount} {props.tokenSymbol}
          </p>
        </div>
        <div className="tx-detail-item">
          <p className="detail-header">Fee</p>
          <p>{props.fee} XLM</p>
        </div>
        <div className="tx-detail-item">
          <p className="detail-header">Memo</p>
          <p>{props.memo}</p>
        </div>
      </div>
      <div className="submit-row-confirm">
        <Button
          size="md"
          variant="tertiary"
          isFullWidth
          onClick={signWithFreighter}
        >
          Sign with Freighter
        </Button>
      </div>
    </>
  );
};
