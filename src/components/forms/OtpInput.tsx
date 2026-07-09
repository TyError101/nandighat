"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, RotateCw } from "lucide-react";

type OtpInputProps = {
  mobile: string;
  onVerified: () => void;
};

const RESEND_SECONDS = 30;

export default function OtpInput({ mobile, onVerified }: OtpInputProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function sendOtp() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
      } else {
        setCooldown(RESEND_SECONDS);
      }
    } catch {
      setError("OTP भेजने में त्रुटि / Failed to send OTP");
    } finally {
      setSending(false);
    }
  }

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    if (next.every((d) => d !== "")) verifyOtp(next.join(""));
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      e.preventDefault();
      setDigits(pasted.split(""));
      verifyOtp(pasted);
    }
  }

  async function verifyOtp(code: string) {
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        onVerified();
      } else {
        setError(data.message);
        setDigits(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch {
      setError("सत्यापन में त्रुटि / Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-semibold text-secondary">OTP दर्ज करें</p>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to +91 {mobile}
        </p>
      </div>

      <div className="flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            inputMode="numeric"
            maxLength={1}
            disabled={verifying}
            className="h-14 w-12 rounded-xl border-2 border-border bg-background text-center text-xl font-bold text-foreground outline-none transition focus:border-primary disabled:opacity-50"
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {verifying && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> सत्यापित हो रहा है / Verifying...
        </p>
      )}

      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Mock OTP: <span className="font-mono font-semibold">123456</span>
        </p>
        <button
          type="button"
          onClick={sendOtp}
          disabled={cooldown > 0 || sending}
          className="flex items-center gap-1 font-medium text-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCw className={`h-3.5 w-3.5 ${sending ? "animate-spin" : ""}`} />
          {cooldown > 0 ? `पुनः भेजें (${cooldown}s)` : "OTP पुनः भेजें / Resend"}
        </button>
      </div>
    </div>
  );
}