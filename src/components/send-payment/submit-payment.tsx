import React from "react";
import {
  Button,
  Card,
  Heading,
  IconButton,
  Icon,
} from "@stellar/design-system";
import { truncateString } from "utils/format";
import { IdenticonImg } from "components/identicon";

interface SubmitPaymentProps {
  amount: string;
  destination: string;
  fee: string;
  pubKey: string;
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
    <div className="signed-xdr">
      <p className="detail-header">Signed XDR</p>
      <Card variant="secondary">
        <div className="xdr-copy">
          <IconButton
            altText="copy signed xdr data"
            icon={<Icon.ContentCopy />}
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
