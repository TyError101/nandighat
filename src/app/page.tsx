import Link from "next/link";
import {
  Waves,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-secondary">
                नंदी घाट
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                Nandi Ghat
              </p>
            </div>
          </div>
          <Link
            href="/register"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            पंजीकरण करें
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, var(--secondary) 0px, var(--secondary) 2px, transparent 2px, transparent 40px)",
          }}
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:py-24">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            <MapPin className="h-4 w-4" />
            माँ नर्मदा उत्तरवाहिनी परिक्रमा
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-secondary sm:text-5xl">
            अपनी पवित्र यात्रा को
            <span className="text-primary"> सदा के लिए संजोएं</span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Preserve your Uttarvahini Narmada Parikrama journey forever
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
            नंदी घाट पर अपनी परिक्रमा पंजीकृत करें और एक आधिकारिक डिजिटल
            प्रमाण-पत्र प्राप्त करें — Register your parikrama and receive an
            official digital certificate.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
            >
              यात्रा पंजीकृत करें
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/verify"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-secondary px-8 py-4 text-lg font-semibold text-secondary transition hover:bg-secondary/5"
            >
              प्रमाण-पत्र जांचें
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-secondary sm:text-3xl">
          नंदी घाट क्यों? <span className="text-muted-foreground text-lg font-normal">/ Why Nandi Ghat</span>
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Award className="h-7 w-7" />}
            titleHi="डिजिटल प्रमाण-पत्र"
            titleEn="Digital Certificate"
            descHi="अपनी परिक्रमा पूर्ण होने का आधिकारिक प्रमाण-पत्र प्राप्त करें, जिसे आप डाउनलोड और साझा कर सकते हैं।"
            descEn="Receive an official certificate of completion, downloadable and shareable."
          />
          <FeatureCard
            icon={<Users className="h-7 w-7" />}
            titleHi="परिवार सहित पंजीकरण"
            titleEn="Family Registration"
            descHi="अपने साथ यात्रा करने वाले परिवारजनों को भी एक साथ पंजीकृत करें।"
            descEn="Register family members who joined your journey together."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-7 w-7" />}
            titleHi="सत्यापित अभिलेख"
            titleEn="Verified Record"
            descHi="प्रत्येक प्रमाण-पत्र को QR कोड द्वारा तुरंत सत्यापित किया जा सकता है।"
            descEn="Every certificate can be instantly verified via QR code."
          />
        </div>
      </section>

      {/* Endorsement */}
      <footer className="mt-auto border-t border-border bg-secondary/5">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">Certified by</p>
          <p className="text-lg font-bold text-secondary">नंदी घाट · Nandi Ghat</p>
          <div className="mx-auto my-4 h-px w-16 bg-primary/40" />
          <p className="text-sm text-muted-foreground">
            Endorsed by
          </p>
          <p className="text-base font-semibold text-foreground">
            Advisor Learning Resorts Limited
          </p>
          <p className="text-sm text-muted-foreground">
            Statue of Unity, Gujarat
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  titleHi,
  titleEn,
  descHi,
  descEn,
}: {
  icon: React.ReactNode;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-secondary">{titleHi}</h3>
      <p className="text-sm font-medium text-muted-foreground">{titleEn}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{descHi}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{descEn}</p>
    </div>
  );
}