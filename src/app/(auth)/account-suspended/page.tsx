"use client";

import Link from "next/link";

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-darkGray text-white p-6 text-center">
      <div className="bg-darkGray p-8 rounded shadow-subtle max-w-lg w-full border border-dangerRed">
        <h1 className="text-3xl font-bold text-dangerRed mb-4">🚫 Account Suspended</h1>
        <p className="mb-4 text-lightGray">
          Your account is currently suspended due to a billing issue. All server access has been restricted.
        </p>
        <p className="mb-6 text-dangerRed">
          Please resolve your payment to regain access. Servers may be permanently deleted after 7 days.
        </p>
        <Link
          href="/billing"
          className="inline-block bg-electricBlue text-black px-6 py-3 rounded font-bold hover:bg-electricBlueLight transition"
        >
          Go to Billing
        </Link>
      </div>
    </div>
  );
}
