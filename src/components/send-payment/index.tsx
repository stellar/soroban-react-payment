import React from "react";
import { createPortal } from "react-dom";
import freighterApi from "@stellar/freighter-api";
import { Card, Caption, Layout, Notification } from "@stellar/design-system";
import { connectNetwork, Networks, NetworkDetails } from "utils/network";
import { ERRORS } from "utils/error";
import { truncateString, xlmToStroop } from "utils/format";
import { getTxBuilder, getTokenSymbol, baseFeeXlm } from "utils/soroban";
import { IdenticonImg } from "components/identicon";
import { ConnectWallet } from "./connect-wallet";
import { TokenInput } from "./token-input";
import { ConfirmPayment } from "./confirm-payment";
import { Fee } from "./fee";
import { PaymentDest } from "./payment-destination";

import "./index.scss";

type StepCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface SendPaymentProps {
  showHeader?: boolean;
}

export const SendPayment = (props: SendPaymentProps) => {
  const showHeader = props.showHeader || true;
  const [activeNetworkDetails, setActiveNetworkDetails] = React.useState(
    {} as NetworkDetails,
  );
  const [activePubKey, setActivePubKey] = React.useState(null as string | null);
  const [stepCount, setStepCount] = React.useState(1 as StepCount);
  const [connectionError, setConnectionError] = React.useState(
    null as string | null,
  );

  // not used yet
  // @ts-ignore
  // eslint-disable-next-line
  const [tokenId, setTokenId] = React.useState("");
  // @ts-ignore
  // eslint-disable-next-line
  const [tokenSymbol, setTokenSymbol] = React.useState("");
  const [fee, setFee] = React.useState(baseFeeXlm);
  const [memo, setMemo] = React.useState("");
  const [paymentDestination, setPaymentDest] = React.useState("");

  async function setToken(id: string) {
    setTokenId(id);

    const txBuilder = getTxBuilder(
      activePubKey!,
      xlmToStroop(fee).toString(),
      activeNetworkDetails.networkPassphrase,
    );

    const symbol = await getTokenSymbol(id, txBuilder, activeNetworkDetails);
    setTokenSymbol(symbol);
  }

  function renderStep(step: StepCount) {
    switch (step) {
      case 6: {
        return (
          <ConfirmPayment
            tokenId={tokenId}
            pubKey={activePubKey!}
            tokenSymbol={tokenSymbol}
            onClick={() => setStepCount((stepCount + 1) as StepCount)}
            network={activeNetworkDetails.network}
            destination={paymentDestination}
            amount="5"
            fee={fee}
            memo={memo}
            networkDetails={activeNetworkDetails}
          />
        );
      }
      case 5: {
        const onClick = () => setStepCount((stepCount + 1) as StepCount);
        return (
          <Fee
            fee={fee}
            memo={memo}
            onClick={onClick}
            setFee={setFee}
            setMemo={setMemo}
          />
        );
      }
      case 4: {
        const onClick = () => setStepCount((stepCount + 1) as StepCount);
        return (
          <Fee
            fee={fee}
            memo={memo}
            onClick={onClick}
            setFee={setFee}
            setMemo={setMemo}
          />
        );
      }
      case 3: {
        const onClick = (value: string) => {
          setToken(value);
          setStepCount((stepCount + 1) as StepCount);
        };
        return <TokenInput onClick={onClick} />;
      }
      case 2: {
        const onClick = () => setStepCount((stepCount + 1) as StepCount);
        return (
          <PaymentDest
            onClick={onClick}
            setDestination={setPaymentDest}
            destination={paymentDestination}
          />
        );
      }
      case 1:
      default: {
        const onClick =
          activeNetworkDetails.network && connectionError === null
            ? () => setStepCount((stepCount + 1) as StepCount)
            : setConnection;
        return (
          <ConnectWallet
            network={activeNetworkDetails.network}
            connectionError={connectionError}
            onClick={onClick}
          />
        );
      }
    }
  }

  async function setConnection() {
    setConnectionError(null);
    setActivePubKey(null);

    const isConnected = await freighterApi.isConnected();

    if (!isConnected) {
      setConnectionError(ERRORS.FREIGHTER_NOT_AVAILABLE);
      return;
    }

    const { networkDetails, pubKey } = await connectNetwork();

    if (networkDetails.network !== Networks.Futurenet) {
      setConnectionError(ERRORS.UNSUPPORTED_NETWORK);
    }

    setActiveNetworkDetails(networkDetails);
    setActivePubKey(pubKey);
  }

  return (
    <>
      {showHeader && (
        <Layout.Header hasThemeSwitch projectId="soroban-react-payment" />
      )}
      <div className="Layout__inset account-badge-row">
        {activePubKey !== null && (
          <div className="account-badge">
            <div className="Badge Badge--pending">
              <IdenticonImg publicKey={activePubKey} />
              <Caption size="xs" addlClassName="badge-pubkey">
                {truncateString(activePubKey)}
              </Caption>
            </div>
          </div>
        )}
      </div>
      <div className="Layout__inset layout">
        <div className="payment">
          <Card variant="primary">
            <Caption size="sm" addlClassName="step-count">
              step {stepCount} of 8
            </Caption>
            {renderStep(stepCount)}
          </Card>
        </div>
        {connectionError !== null &&
          createPortal(
            <div className="notification-container">
              <Notification title={connectionError!} variant="error" />
            </div>,
            document.getElementById("root")!,
          )}
      </div>
    </>
  );
};
