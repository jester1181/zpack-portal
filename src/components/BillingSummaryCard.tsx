import Link from "next/link";

const BillingSummaryCard = ({ status, daysRemaining }: { status: string; daysRemaining?: number }) => {
  const statusColor = {
    active: "text-green-400",
    past_due: "text-yellow-400",
    suspended: "text-red-500",
  }[status] || "text-white";

  const message = {
    active: "Your account is in good standing.",
    past_due: "Your account is past due. Please resolve soon.",
    suspended: `Account suspended. ${daysRemaining ? `${daysRemaining} day(s) remaining before full lockout.` : ""}`,
  }[status] || "Billing status unknown.";

  return (
    <div className="bg-darkGray p-4 rounded shadow text-center">
      <h3 className="text-lg font-bold text-white mb-2">💳 Billing Summary</h3>
      <p className={`${statusColor} font-semibold`}>{message}</p>
      <Link href="/billing" className="text-electricBlue underline text-sm mt-2 inline-block">Manage Billing</Link>
    </div>
  );
};

export default BillingSummaryCard;
