import React from "react";
import {
  Button,
  Card,
  Heading,
  IconButton,
  Icon,
  Profile,
} from "@stellar/design-system";

interface SubmitPaymentProps {
  amount: string;
  destination: string;
  fee: string;
  memo: string;
  network: string;
  onClick: () => void;
  tokenSymbol: string;
}

export const SubmitPayment = (props: SubmitPaymentProps) => (
  <>
    <Heading as="h1" size="sm">
      Submit Payment
    </Heading>
    <div className="tx-details">
      <div className="tx-detail-item">
        <p className="detail-header">Network</p>
        <p>{props.network}</p>
      </div>
      <div className="tx-detail-item">
        <p className="detail-header">To</p>
        <div className="dest-identicon">
          <Profile isShort publicAddress={props.destination} size="sm" />
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
    <div className="signed-xdr">
      <p className="detail-header">Signed XDR</p>
      <Card variant="secondary">
        <div className="xdr-copy">
          <IconButton
            altText="copy signed xdr data"
            icon={<Icon.ContentCopy key="copy-icon" />}
          />
        </div>
      </Card>
    </div>
    <div className="submit-row-confirm">
      <Button size="md" variant="tertiary" isFullWidth onClick={props.onClick}>
        Submit Payment
      </Button>
    </div>
  </>
);
