"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Waves,
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import OtpInput from "@/components/forms/OtpInput";

type FamilyMember = {
  id: number;
  name: string;
  relation: string;
  mobile: string;
};

const YEAR_OPTIONS = [2024, 2025, 2026];

// mock pincode -> city/state lookup
const PINCODE_MOCK: Record<string, { city: string; state: string }> = {
  "391760": { city: "Kevadia", state: "Gujarat" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "110001": { city: "New Delhi", state: "Delhi" },
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = personal info, 2 = OTP, 3 = photo & family
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Step 1 state
  const [fullName, setFullName] = useState("");
  const [hindiName, setHindiName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [gotra, setGotra] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [year, setYear] = useState(2026);

  // Step 3 state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [hasFamily, setHasFamily] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const inviteLink = "https://nandighat.vercel.app/i/NG-INV-8823";

  function handlePincodeChange(value: string) {
    setPincode(value);
    if (value.length === 6 && PINCODE_MOCK[value]) {
      setCity(PINCODE_MOCK[value].city);
      setState(PINCODE_MOCK[value].state);
    } else if (value.length === 6) {
      setCity("");
      setState("");
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  function addFamilyMember() {
    setFamilyMembers((prev) => [
      ...prev,
      { id: Date.now(), name: "", relation: "", mobile: "" },
    ]);
  }

  function updateFamilyMember(
    id: number,
    field: keyof Omit<FamilyMember, "id">,
    value: string
  ) {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  }

  function removeFamilyMember(id: number) {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function copyInviteLink() {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          fullNameHi: hindiName,
          gender,
          dob,
          gotra,
          mobile,
          pincode,
          city,
          state,
          year,
          familyMembers: familyMembers.map(({ name, relation, mobile }) => ({
            name,
            relation,
            mobile,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/pilgrim/${data.slug}`);
      } else {
        setSubmitError(data.message || "पंजीकरण विफल / Registration failed");
      }
    } catch {
      setSubmitError("नेटवर्क त्रुटि / Network error, please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Waves className="h-4 w-4" />
            </div>
            <div>
              <p className="text-base font-bold leading-none text-secondary">
                नंदी घाट
              </p>
              <p className="text-[11px] leading-none text-muted-foreground">
                Nandi Ghat
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto w-full max-w-2xl px-4 pt-6">
        <div className="flex items-center gap-3">
          <StepDot active={step >= 1} label="1" />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <StepDot active={step >= 2} label="2" />
          <div className={`h-1 flex-1 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          <StepDot active={step >= 3} label="3" />
        </div>
        <div className="mt-2 flex justify-between text-sm font-medium text-muted-foreground">
          <span className={step === 1 ? "text-secondary" : ""}>
            व्यक्तिगत जानकारी
          </span>
          <span className={step === 2 ? "text-secondary" : ""}>
            OTP सत्यापन
          </span>
          <span className={step === 3 ? "text-secondary" : ""}>
            फोटो व परिवार
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                व्यक्तिगत जानकारी
              </h1>
              <p className="text-muted-foreground">Personal Information</p>
            </div>

            <Field label="पूरा नाम" labelEn="Full Name" required>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="जैसे: रमेश पटेल"
                className={inputClass}
              />
            </Field>

            <Field label="हिंदी नाम" labelEn="Hindi Name" required>
              <input
                value={hindiName}
                onChange={(e) => setHindiName(e.target.value)}
                type="text"
                placeholder="रमेश पटेल"
                className={inputClass}
              />
            </Field>

            <Field label="लिंग" labelEn="Gender" required>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { v: "male", hi: "पुरुष", en: "Male" },
                  { v: "female", hi: "महिला", en: "Female" },
                  { v: "other", hi: "अन्य", en: "Other" },
                ].map((g) => (
                  <button
                    key={g.v}
                    type="button"
                    onClick={() => setGender(g.v)}
                    className={`rounded-xl border-2 py-3 text-center transition ${
                      gender === g.v
                        ? "border-primary bg-primary/10 text-secondary"
                        : "border-border text-foreground/70"
                    }`}
                  >
                    <div className="font-semibold">{g.hi}</div>
                    <div className="text-xs text-muted-foreground">{g.en}</div>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="जन्म तिथि" labelEn="Date of Birth" required>
              <input
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                type="date"
                className={inputClass}
              />
            </Field>

            <Field label="परिक्रमा वर्ष" labelEn="Parikrama Year" required>
              <div className="grid grid-cols-3 gap-3">
                {YEAR_OPTIONS.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYear(y)}
                    className={`rounded-xl border-2 py-3 text-center font-semibold transition ${
                      year === y
                        ? "border-primary bg-primary/10 text-secondary"
                        : "border-border text-foreground/70"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="गोत्र" labelEn="Gotra (optional)">
              <input
                value={gotra}
                onChange={(e) => setGotra(e.target.value)}
                type="text"
                placeholder="जैसे: कश्यप"
                className={inputClass}
              />
            </Field>

            <Field label="मोबाइल नंबर" labelEn="Mobile Number" required>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                className={inputClass}
              />
            </Field>

            <Field label="पिनकोड" labelEn="Pincode" required>
              <input
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                type="text"
                maxLength={6}
                placeholder="391760"
                className={inputClass}
              />
              {(city || state) && (
                <p className="mt-2 text-sm text-secondary">
                  {city}, {state}
                </p>
              )}
            </Field>

            <button
              onClick={() => setStep(2)}
              disabled={
                !fullName ||
                !hindiName ||
                !gender ||
                !dob ||
                !mobile ||
                mobile.length !== 10 ||
                !pincode
              }
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-lg font-semibold text-primary-foreground shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              आगे बढ़ें / Continue
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                मोबाइल सत्यापन
              </h1>
              <p className="text-muted-foreground">Mobile Verification</p>
            </div>

            <OtpInput mobile={mobile} onVerified={() => setStep(3)} />

            <button
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-secondary px-6 py-3 font-semibold text-secondary transition hover:bg-secondary/5"
            >
              <ArrowLeft className="h-5 w-5" />
              वापस / Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                फोटो व परिवार विवरण
              </h1>
              <p className="text-muted-foreground">Photo & Family Details</p>
            </div>

            {/* Photo upload */}
            <Field label="फोटो प्रमाण" labelEn="Photo Proof" required>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 py-10 text-center transition hover:bg-primary/10">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-28 w-28 rounded-xl object-cover"
                  />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-primary" />
                    <span className="font-medium text-secondary">
                      फोटो अपलोड करें
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Tap to upload photo
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">
                नोट: फोटो अभी सर्वर पर सेव नहीं होती (Cloudinary Phase 2 Step 3 में) / Photo isn&apos;t saved to server yet
              </p>
            </Field>

            {/* Family toggle */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-secondary">
                    क्या परिवार साथ था?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Did family join your journey?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasFamily(!hasFamily)}
                  className={`relative h-8 w-14 rounded-full transition ${
                    hasFamily ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                      hasFamily ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {hasFamily && (
                <div className="mt-5 space-y-4">
                  {familyMembers.map((m) => (
                    <div
                      key={m.id}
                      className="space-y-3 rounded-xl border border-border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-muted-foreground">
                          सदस्य / Member
                        </p>
                        <button
                          onClick={() => removeFamilyMember(m.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        placeholder="नाम / Name"
                        value={m.name}
                        onChange={(e) =>
                          updateFamilyMember(m.id, "name", e.target.value)
                        }
                        className={inputClass}
                      />
                      <input
                        placeholder="संबंध / Relation (e.g. पत्नी / Wife)"
                        value={m.relation}
                        onChange={(e) =>
                          updateFamilyMember(m.id, "relation", e.target.value)
                        }
                        className={inputClass}
                      />
                      <input
                        placeholder="मोबाइल (वैकल्पिक) / Mobile (optional)"
                        value={m.mobile}
                        onChange={(e) =>
                          updateFamilyMember(m.id, "mobile", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFamilyMember}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 py-3 font-medium text-secondary transition hover:bg-primary/5"
                  >
                    <Plus className="h-4 w-4" />
                    सदस्य जोड़ें / Add Member
                  </button>
                </div>
              )}
            </div>

            {/* Invite link */}
            <div className="rounded-2xl border border-accent/50 bg-accent/10 p-5">
              <p className="font-semibold text-secondary">
                परिवार को आमंत्रित करें
              </p>
              <p className="text-sm text-muted-foreground">
                Invite family with this link
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background p-2">
                <span className="flex-1 truncate px-2 text-sm text-foreground/80">
                  {inviteLink}
                </span>
                <button
                  onClick={copyInviteLink}
                  className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "कॉपी हुआ" : "कॉपी करें"}
                </button>
              </div>
            </div>

            {submitError && (
              <p className="text-sm font-medium text-destructive">{submitError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-secondary px-6 py-4 font-semibold text-secondary transition hover:bg-secondary/5 disabled:opacity-40"
              >
                <ArrowLeft className="h-5 w-5" />
                वापस
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-4 text-lg font-semibold text-primary-foreground shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    सबमिट हो रहा है...
                  </>
                ) : (
                  "पंजीकरण पूर्ण करें / Submit"
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-border bg-background px-4 py-3.5 text-base text-foreground outline-none transition focus:border-primary";

function Field({
  label,
  labelEn,
  required,
  children,
}: {
  label: string;
  labelEn: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block">
        <span className="font-semibold text-secondary">{label}</span>{" "}
        {required && <span className="text-primary">*</span>}
        <span className="ml-1 text-sm text-muted-foreground">/ {labelEn}</span>
      </label>
      {children}
    </div>
  );
}

function StepDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {label}
    </div>
  );
}