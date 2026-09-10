"use client";

import { CodeStep } from "../code-step";
import { NewPasswordStep } from "./new-password-step";
import { RequestStep } from "./request-step";
import { useReset } from "./use-reset";

/** Thin orchestrator for the password-reset flow. No brand header (per design). */
export function ResetForm() {
  const reset = useReset();

  switch (reset.step) {
    case "request":
      return <RequestStep reset={reset} />;
    case "code":
      return (
        <CodeStep
          email={reset.email}
          error={reset.error}
          pending={reset.pending}
          resendIn={reset.resendIn}
          backLabel="Back"
          onVerify={reset.verifyCode}
          onResend={() => void reset.sendCode()}
          onBack={reset.backToRequest}
        />
      );
    case "password":
      return <NewPasswordStep reset={reset} />;
  }
}
