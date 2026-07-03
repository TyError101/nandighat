import Link from "next/link";
import {
  Waves,
  MapPin,
  Award,
  Users,
  Calendar,
  ArrowLeft,
} from "lucide-react";

// Phase 1: hardcoded mock pilgrim data (slug ignored for now)
const MOCK_PILGRIM = {
  fullName: "Ramesh Patel",
  hindiName: "रमेश पटेल",
  gotra: "कश्यप",
  gender: "पुरुष",
  age: 58,
  city: "Kevadia",
  state: "Gujarat",
  parikramaYear: 2026,
  certificateId: "NG-2026-000001",
  photoUrl: "",
  family: [
    { name: "सुनिता पटेल", relation: "पत्नी / Wife" },
    { name: "विकास पटेल", relation: "पुत्र / Son" },
  ],
};

export default async function PilgrimProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pilgrim = MOCK_PILGRIM;

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
                {pilgrim.hindiName.charAt(0)}
              </div>
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold text-secondary">
                {pilgrim.hindiName}
              </h1>
              <p className="text-muted-foreground">{pilgrim.fullName}</p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-secondary">
                <MapPin className="h-3.5 w-3.5" />
                {pilgrim.city}, {pilgrim.state}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <InfoTile label="गोत्र" labelEn="Gotra" value={pilgrim.gotra} />
              <InfoTile label="लिंग" labelEn="Gender" value={pilgrim.gender} />
              <InfoTile
                label="आयु"
                labelEn="Age"
                value={`${pilgrim.age} वर्ष`}
              />
              <InfoTile
                label="परिक्रमा वर्ष"
                labelEn="Parikrama Year"
                value={String(pilgrim.parikramaYear)}
              />
            </div>
          </div>
        </div>

        {/* Certificate CTA */}
        <Link
          href={`/certificate/${pilgrim.certificateId}`}
          className="mt-6 flex items-center justify-between rounded-2xl border border-accent/50 bg-accent/10 p-5 transition hover:bg-accent/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-secondary">प्रमाण-पत्र देखें</p>
              <p className="text-sm text-muted-foreground">
                {pilgrim.certificateId}
              </p>
            </div>
          </div>
          <span className="text-primary">→</span>
        </Link>

        {/* Family */}
        {pilgrim.family.length > 0 && (
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
              {pilgrim.family.map((m, i) => (
                <div
                  key={i}
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
        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-secondary/5 p-5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0 text-secondary" />
          <span>
            {pilgrim.hindiName} ने {pilgrim.parikramaYear} में माँ नर्मदा की
            उत्तरवाहिनी परिक्रमा पूर्ण की।
          </span>
        </div>
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