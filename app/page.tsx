import Link from "next/link";

function BanyanTreeSVG() {
  return (
    <svg
      viewBox="0 0 400 500"
      className="mx-auto h-[320px] w-auto opacity-20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Trunk */}
      <path
        d="M190 480 C190 380, 170 340, 180 280 C185 250, 195 230, 200 200"
        stroke="#1B4332"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M210 480 C210 380, 230 340, 220 280 C215 250, 205 230, 200 200"
        stroke="#1B4332"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Aerial roots */}
      <path
        d="M160 300 C155 360, 145 420, 140 480"
        stroke="#1B4332"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M240 300 C245 360, 255 420, 260 480"
        stroke="#1B4332"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M130 260 C120 340, 110 400, 105 480"
        stroke="#1B4332"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M270 260 C280 340, 290 400, 295 480"
        stroke="#1B4332"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Main branches */}
      <path
        d="M200 200 C170 180, 120 170, 80 160"
        stroke="#1B4332"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M200 200 C230 180, 280 170, 320 160"
        stroke="#1B4332"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M200 220 C160 200, 100 210, 60 220"
        stroke="#1B4332"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M200 220 C240 200, 300 210, 340 220"
        stroke="#1B4332"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M200 180 C180 150, 150 120, 130 100"
        stroke="#1B4332"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M200 180 C220 150, 250 120, 270 100"
        stroke="#1B4332"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Canopy - large leaf clusters */}
      <ellipse cx="80" cy="150" rx="55" ry="40" fill="#1B4332" opacity="0.15" />
      <ellipse cx="320" cy="150" rx="55" ry="40" fill="#1B4332" opacity="0.15" />
      <ellipse cx="60" cy="210" rx="50" ry="35" fill="#1B4332" opacity="0.12" />
      <ellipse cx="340" cy="210" rx="50" ry="35" fill="#1B4332" opacity="0.12" />
      <ellipse cx="130" cy="100" rx="50" ry="38" fill="#1B4332" opacity="0.15" />
      <ellipse cx="270" cy="100" rx="50" ry="38" fill="#1B4332" opacity="0.15" />
      <ellipse cx="200" cy="80" rx="60" ry="42" fill="#1B4332" opacity="0.18" />
      <ellipse cx="150" cy="150" rx="45" ry="32" fill="#1B4332" opacity="0.1" />
      <ellipse cx="250" cy="150" rx="45" ry="32" fill="#1B4332" opacity="0.1" />
      {/* Top crown */}
      <ellipse cx="200" cy="55" rx="45" ry="30" fill="#1B4332" opacity="0.12" />
      <ellipse cx="160" cy="70" rx="40" ry="28" fill="#1B4332" opacity="0.1" />
      <ellipse cx="240" cy="70" rx="40" ry="28" fill="#1B4332" opacity="0.1" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(27,67,50,0.03)_0%,transparent_70%)]" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        {/* Banyan tree motif */}
        <div className="fade-in mb-[-40px]">
          <BanyanTreeSVG />
        </div>

        {/* Sanskrit/Devanagari accent */}
        <p className="fade-in-up fade-in-delay-1 mb-3 text-sm tracking-[0.3em] text-gold">
          वंशवृक्ष
        </p>

        {/* Main title */}
        <h1 className="fade-in-up fade-in-delay-1 font-display text-5xl font-bold tracking-tight text-forest sm:text-6xl md:text-7xl">
          Dhakephalkar
        </h1>

        {/* Decorative divider */}
        <div className="fade-in-up fade-in-delay-2 my-6 flex items-center gap-3">
          <div className="h-px w-12 bg-gold/40" />
          <div className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <div className="h-px w-12 bg-gold/40" />
        </div>

        {/* Subtitle */}
        <p className="fade-in-up fade-in-delay-2 mb-10 text-lg text-forest/70 sm:text-xl">
          Our Family, Our Story
        </p>

        {/* CTA Button */}
        <Link
          href="/tree"
          className="fade-in-up fade-in-delay-3 group btn-primary px-8 py-4 text-base"
        >
          Explore the Family Tree
          <svg
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </main>
  );
}
