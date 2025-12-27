"use client";

import Modal from "@/components/Modal";
import { useAccessControl } from "@/hooks/useAccessControl";

export default function BillingModal() {
  const { isSuspended } = useAccessControl();

  if (!isSuspended) return null;

  return (
    <Modal
      isOpen={true}
      onClose={() => {}}
      onConfirm={() => {
        window.location.href = "/billing";
      }}
      title="Account Suspended"
      message="Your account has been suspended due to billing issues. Please update your billing to continue using ZeroLagHub."
      confirmText="Go to Billing"
      cancelText="Close"
    />
  );
}
