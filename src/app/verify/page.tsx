"use client";

import { useState } from "react";
import Link from "next/link";
import { Waves, Search, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

const MOCK_DB: Record<string, { hindiName: string; fullName: string; gotra: string; year: number }> = {
  "NG-2026-000001": { hindiName: "रमेश पटेल", fullName: "Ramesh Patel", gotra: "कश्यप", year: 2026 },
};

export default function VerifyPage() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<"idle" | "valid" | "invalid">("idle");
  const [data, setData] = useState<(typeof MOCK_DB)[string] | null>(null);

  function handleVerify() {
    const found = MOCK_DB[certId.trim().toUpperCase()];
    if (found) {
      setData(found);
      setResult("valid");
    } else {
      setData(null);
      setResult("invalid");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Waves className="h-4 w-4" />
            </div>
            <p className="text-base font-bold text-secondary">नंदी घाट</p>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-secondary">
            <ArrowLeft className="h-4 w-4" /> होम
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary">प्रमाण-पत्र सत्यापन</h1>
          <p className="text-muted-foreground">Certificate Verification</p>
        </div>

        <div className="mt-8 flex gap-2">
          <input
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="NG-2026-000001"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3.5 text-base outline-none focus:border-primary"
          />
          <button
            onClick={handleVerify}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground hover:opacity-90"
          >
            <Search className="h-5 w-5" />
            जांचें
          </button>
        </div>

        {result === "valid" && data && (
          <div className="mt-8 rounded-2xl border-2 border-green-500/30 bg-green-500/5 p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
            <p className="mt-2 font-semibold text-green-700">प्रमाण-पत्र वैध है / Certificate is valid</p>
            <div className="mx-auto mt-4 h-px w-16 bg-green-500/30" />
            <h2 className="mt-4 text-xl font-bold text-secondary">{data.hindiName}</h2>
            <p className="text-muted-foreground">{data.fullName}</p>
            <div className="mx-auto mt-4 grid max-w-xs grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-card p-3"><p className="font-bold text-secondary">{data.gotra}</p><p className="text-xs text-muted-foreground">गोत्र</p></div>
              <div className="rounded-xl bg-card p-3"><p className="font-bold text-secondary">{data.year}</p><p className="text-xs text-muted-foreground">वर्ष</p></div>
            </div>
          </div>
        )}

        {result === "invalid" && (
          <div className="mt-8 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6 text-center">
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
            <p className="mt-2 font-semibold text-destructive">प्रमाण-पत्र नहीं मिला / Certificate not found</p>
          </div>
        )}
      </main>
    </div>
  );
}