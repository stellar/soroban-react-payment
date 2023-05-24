import React from "react";
import { createPortal } from "react-dom";
import freighterApi from "@stellar/freighter-api";
import {
  Button,
  Card,
  Caption,
  Heading,
  Layout,
  Notification,
} from "@stellar/design-system";
import { connectNetwork, Networks, NetworkDetails } from "utils/network";
import { ERRORS } from "utils/error";
import { truncateString } from "utils/format";
import { IdenticonImg } from "components/identicon";

import "./index.scss";

interface SendPaymentProps {
  showHeader?: boolean;
}

export const SendPayment = (props: SendPaymentProps) => {
  const showHeader = props.showHeader || true;
  const [activeNetworkDetails, setActiveNetworkDetails] = React.useState(
    {} as NetworkDetails,
  );
  const [activePubKey, setActivePubKey] = React.useState(null as string | null);
  const [stepCount, setStepCount] = React.useState(1);
  const [connectionError, setConnectionError] = React.useState(
    null as string | null,
  );

  function renderStep(step: number) {
    switch (step) {
      case 1:
      default:
        return (
          // add next steps, TBD
          <div />
        );
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
            <Heading as="h1" size="sm">
              Send a Soroban Payment
            </Heading>
            {renderStep(stepCount)}
            <div className="submit-row">
              {activeNetworkDetails.network && connectionError === null ? (
                <Button
                  size="md"
                  variant="tertiary"
                  isFullWidth
                  onClick={() => setStepCount(stepCount + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="md"
                  variant="tertiary"
                  isFullWidth
                  onClick={setConnection}
                >
                  Connect Freighter
                </Button>
              )}
            </div>
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
