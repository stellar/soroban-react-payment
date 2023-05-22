import React from "react"
import {
  Button,
  Card,
  Caption,
  Heading,
  Layout
} from "@stellar/design-system"
import { Networks, connectNetwork } from "utils"
import { SelectNetwork } from "./select-network"

import "./index.scss"

interface SendPaymentProps {
  showHeader?: boolean
}

function SendPayment(props: SendPaymentProps) {
  const showHeader = props.showHeader || true
  const [activeNetwork] = React.useState(Networks.Futurenet)
  const [stepCount] = React.useState(1)

  function renderStep(step: number) {
    switch (step) {
      case 1:
      default:
        return (
          <SelectNetwork selectedNetwork={activeNetwork} />
        )
    }
  }

  return (
    <>
      {showHeader && (
        <Layout.Header hasThemeSwitch projectId="soroban-react-payment" />
      )}
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
              <Button size="md" variant="tertiary" isFullWidth onClick={connectNetwork}>
                Connect Freighter
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export { SendPayment }