import React from "react"
import { Card, Caption, Layout } from "@stellar/design-system"

import "./index.scss"

interface SendPaymentProps {
  showHeader?: boolean
}

function SendPayment(props: SendPaymentProps) {
  const showHeader = props.showHeader || true
  const [stepCount] = React.useState(1)
  return (
    <>
      {showHeader && (
        <Layout.Header hasThemeSwitch projectId="soroban-react-payment" />
      )}
      <div className="Layout__inset layout">
        <div className="payment">
          <Card variant="primary">
            <Caption size="xs" className="step-count">
              step {stepCount} of 8
            </Caption>
          </Card>
        </div>
      </div>
    </>
  )
}

export { SendPayment }