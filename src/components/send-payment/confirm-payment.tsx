import React from "react";
import { Button, Heading } from "@stellar/design-system";
import { truncateString } from "utils/format";
import { NetworkDetails, signTx } from "utils/network";
import { makePayment, getTxBuilder } from "utils/soroban";
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
  tokenSymbol: string;
  networkDetails: NetworkDetails;
}

export const ConfirmPayment = (props: ConfirmPaymentProps) => {
  const signWithFreighter = async () => {
    const builder = getTxBuilder(
      props.pubKey,
      props.fee,
      props.networkDetails.networkPassphrase,
    );
    const xdr = await makePayment(
      props.tokenId,
      props.amount,
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
