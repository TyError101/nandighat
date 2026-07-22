"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Waves, ArrowRight } from "lucide-react";
import OtpInput from "@/components/forms/OtpInput";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleVerified() {
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.role === "ADMIN") {
        router.push("/admin");
      } else {
        await fetch("/api/auth/logout", { method: "POST" });
        setError("यह नंबर एडमिन नहीं है / This number is not an admin");
        setStep(1);
      }
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Waves className="h-4 w-4" />
        </div>
        <div>
          <p className="text-base font-bold leading-none text-secondary">नंदी घाट</p>
          <p className="text-[11px] leading-none text-muted-foreground">Admin Login</p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border p-6">
        {step === 1 && (
          <>
            <div>
              <h1 className="text-xl font-bold text-secondary">एडमिन लॉगिन</h1>
              <p className="text-sm text-muted-foreground">Admin Login</p>
            </div>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              className="w-full rounded-xl border-2 border-border bg-background px-4 py-3.5 text-base text-foreground outline-none transition focus:border-primary"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              onClick={() => setStep(2)}
              disabled={mobile.length !== 10}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              OTP भेजें / Send OTP
              <ArrowRight className="h-5 w-5" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <OtpInput mobile={mobile} onVerified={handleVerified} />
            {checking && (
              <p className="text-sm text-muted-foreground">जाँच हो रही है... / Checking...</p>
            )}
          </>
        )}

        <Link href="/" className="block text-center text-sm text-muted-foreground">
          ← होम पर वापस जाएँ
        </Link>
      </div>
    </div>
  );
}