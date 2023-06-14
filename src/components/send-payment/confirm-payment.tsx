import React from "react";
import { Button, Heading, Profile } from "@stellar/design-system";
import { StellarWalletsKit } from "stellar-wallets-kit";
import { NetworkDetails, signTx } from "../../helpers/network";
import {
  makePayment,
  getTxBuilder,
  parseTokenAmount,
  getServer,
} from "../../helpers/soroban";
import { ERRORS } from "../../helpers/error";

interface ConfirmPaymentProps {
  amount: string;
  destination: string;
  fee: string;
  pubKey: string;
  kit: StellarWalletsKit;
  memo: string;
  network: string;
  onTxSign: (xdr: string) => void;
  tokenId: string;
  tokenDecimals: number;
  tokenSymbol: string;
  networkDetails: NetworkDetails;
  setError: (error: string) => void;
}

export const ConfirmPayment = (props: ConfirmPaymentProps) => {
  const signWithFreighter = async () => {
    const amount = parseTokenAmount(props.amount, props.tokenDecimals);
    const server = getServer(props.networkDetails);
    const builder = await getTxBuilder(
      props.pubKey,
      props.fee,
      server,
      props.networkDetails.networkPassphrase,
    );
    const xdr = await makePayment(
      props.tokenId,
      amount.toNumber(),
      props.destination,
      props.pubKey,
      props.memo,
      builder,
      server,
      props.networkDetails.networkPassphrase,
    );
    try {
      const signedTx = await signTx(xdr, props.pubKey, props.kit);
      props.onTxSign(signedTx);
    } catch (error) {
      console.log(error);
      props.setError(ERRORS.UNABLE_TO_SIGN_TX);
    }
  };
  return (
    <>
      <Heading as="h1" size="sm">
        Confirm Payment
      </Heading>
      <div className="tx-details">
        <div className="tx-detail-item">
          <p className="detail-header">Network</p>
          <p className="detail-value">{props.network}</p>
        </div>
        <div className="tx-detail-item">
          <p className="detail-header">To</p>
          <div className="dest-identicon">
            <Profile isShort publicAddress={props.destination} size="sm" />
          </div>
        </div>
        <div className="tx-detail-item">
          <p className="detail-header">Amount</p>
          <p className="detail-value">
            {props.amount} {props.tokenSymbol}
          </p>
        </div>
        <div className="tx-detail-item">
          <p className="detail-header">Fee</p>
          <p className="detail-value">{props.fee} XLM</p>
        </div>
        <div className="tx-detail-item">
          <p className="detail-header">Memo</p>
          <p className="detail-value">{props.memo}</p>
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
