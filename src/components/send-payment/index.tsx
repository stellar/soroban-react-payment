import React from "react";
import { Card, Caption, Layout, Notification } from "@stellar/design-system";
import freighterApi from "@stellar/freighter-api";

import { connectNetwork, Networks, NetworkDetails } from "helpers/network";
import { createPortal } from "react-dom";
import { ERRORS } from "helpers/error";
import {
  getTxBuilder,
  BASE_FEE,
  XLM_DECIMALS,
  getTokenSymbol,
  getTokenBalance,
  getTokenDecimals,
} from "helpers/soroban";
import { truncateString } from "helpers/format";
import { IdenticonImg } from "components/identicon";
import { SendAmount } from "./send-amount";
import { ConnectWallet } from "./connect-wallet";
import { PaymentDest } from "./payment-destination";
import { TokenInput } from "./token-input";
import { ConfirmPayment } from "./confirm-payment";
import { Fee } from "./fee";

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

  const [tokenId, setTokenId] = React.useState("");
  const [paymentDestination, setPaymentDest] = React.useState("");
  const [sendAmount, setSendAmount] = React.useState("");
  const [tokenSymbol, setTokenSymbol] = React.useState("");
  const [tokenBalance, setTokenBalance] = React.useState("");
  const [fee, setFee] = React.useState(BASE_FEE);
  const [memo, setMemo] = React.useState("");

  // @ts-ignore
  // eslint-disable-next-line
  const [signedXdr, setSignedXdr] = React.useState("");

  // @ts-ignore
  // eslint-disable-next-line
  const [tokenDecimals, setTokenDecimals] = React.useState(XLM_DECIMALS);

  async function setToken(id: string) {
    setTokenId(id);

    const txBuilderSymbol = getTxBuilder(
      activePubKey!,
      BASE_FEE,
      activeNetworkDetails.networkPassphrase,
    );

    const symbol = await getTokenSymbol(
      id,
      txBuilderSymbol,
      activeNetworkDetails,
    );
    setTokenSymbol(symbol);

    const txBuilderBalance = getTxBuilder(
      activePubKey!,
      BASE_FEE,
      activeNetworkDetails.networkPassphrase,
    );
    const balance = await getTokenBalance(
      activePubKey!,
      id,
      txBuilderBalance,
      activeNetworkDetails,
    );
    setTokenBalance(balance);

    const txBuilderDecimals = getTxBuilder(
      activePubKey!,
      BASE_FEE,
      activeNetworkDetails.networkPassphrase,
    );
    const decimals = await getTokenDecimals(
      id,
      txBuilderDecimals,
      activeNetworkDetails,
    );
    setTokenDecimals(decimals);
  }

  function renderStep(step: StepCount) {
    switch (step) {
      case 7: {
        const setSignedTx = (xdr: string) => {
          setSignedXdr(xdr);
          setStepCount((stepCount + 1) as StepCount);
        };
        return (
          <ConfirmPayment
            tokenId={tokenId}
            tokenDecimals={tokenDecimals}
            pubKey={activePubKey!}
            tokenSymbol={tokenSymbol}
            onTxSign={setSignedTx}
            network={activeNetworkDetails.network}
            destination={paymentDestination}
            amount={sendAmount}
            fee={fee}
            memo={memo}
            networkDetails={activeNetworkDetails}
          />
        );
      }
      case 6: {
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
      case 5: {
        const onClick = () => setStepCount((stepCount + 1) as StepCount);
        return (
          <SendAmount
            amount={sendAmount}
            decimals={tokenDecimals}
            setAmount={setSendAmount}
            onClick={onClick}
            balance={tokenBalance}
            tokenSymbol={tokenSymbol}
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
        const onClick = async (value: string) => {
          await setToken(value);
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
