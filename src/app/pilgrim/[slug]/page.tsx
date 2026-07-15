import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Waves,
  MapPin,
  Award,
  Users,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

const GENDER_LABELS: Record<string, string> = {
  male: "पुरुष",
  female: "महिला",
  other: "अन्य",
};

function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

async function getPilgrimBySlug(slug: string) {
  const pilgrim = await prisma.pilgrim.findUnique({
    where: { slug },
    include: {
      parikramas: {
        orderBy: { year: "desc" },
        include: {
          familyMembers: true,
          certificate: true,
        },
      },
    },
  });
  return pilgrim;
}

export default async function PilgrimProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pilgrim = await getPilgrimBySlug(slug);

  if (!pilgrim) {
    notFound();
  }

  const parikrama = pilgrim.parikramas[0]; // most recent
  const age = calculateAge(pilgrim.dob);
  const genderLabel = GENDER_LABELS[pilgrim.gender] ?? pilgrim.gender;
  const locationLabel = [pilgrim.city, pilgrim.state].filter(Boolean).join(", ");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
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
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium text-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            होम
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        {/* Profile card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="relative h-24 bg-gradient-to-r from-primary to-accent">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(115deg, white 0px, white 2px, transparent 2px, transparent 30px)",
              }}
            />
          </div>
          <div className="px-6 pb-6">
            <div className="-mt-12 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-muted text-3xl font-bold text-secondary shadow-md">
                {pilgrim.fullNameHi?.charAt(0) ?? pilgrim.fullName.charAt(0)}
              </div>
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold text-secondary">
                {pilgrim.fullNameHi || pilgrim.fullName}
              </h1>
              <p className="text-muted-foreground">{pilgrim.fullName}</p>
              {locationLabel && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-secondary">
                  <MapPin className="h-3.5 w-3.5" />
                  {locationLabel}
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <InfoTile
                label="गोत्र"
                labelEn="Gotra"
                value={pilgrim.gotra || "—"}
              />
              <InfoTile label="लिंग" labelEn="Gender" value={genderLabel} />
              <InfoTile label="आयु" labelEn="Age" value={`${age} वर्ष`} />
              <InfoTile
                label="परिक्रमा वर्ष"
                labelEn="Parikrama Year"
                value={parikrama ? String(parikrama.year) : "—"}
              />
            </div>
          </div>
        </div>

        {/* Certificate CTA */}
        {parikrama?.certificate ? (
          <Link
            href={`/certificate/${parikrama.certificate.certId}`}
            className="mt-6 flex items-center justify-between rounded-2xl border border-accent/50 bg-accent/10 p-5 transition hover:bg-accent/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-secondary">प्रमाण-पत्र देखें</p>
                <p className="text-sm text-muted-foreground">
                  {parikrama.certificate.certId}
                </p>
              </div>
            </div>
            <span className="text-primary">→</span>
          </Link>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">
                प्रमाण-पत्र तैयार हो रहा है
              </p>
              <p className="text-sm text-muted-foreground">
                Certificate pending approval
              </p>
            </div>
          </div>
        )}

        {/* Family */}
        {parikrama && parikrama.familyMembers.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="font-semibold text-secondary">
                साथ यात्रा करने वाले
              </p>
              <span className="text-sm text-muted-foreground">
                / Travelled with
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {parikrama.familyMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                >
                  <span className="font-medium text-foreground">
                    {m.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {m.relation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journey note */}
        {parikrama && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-secondary/5 p-5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0 text-secondary" />
            <span>
              {pilgrim.fullNameHi || pilgrim.fullName} ने {parikrama.year} में
              माँ नर्मदा की उत्तरवाहिनी परिक्रमा पूर्ण की।
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

function InfoTile({
  label,
  labelEn,
  value,
}: {
  label: string;
  labelEn: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/50 p-3 text-center">
      <p className="text-lg font-bold text-secondary">{value}</p>
      <p className="text-xs text-muted-foreground">
        {label} / {labelEn}
      </p>
    </div>
  );
}