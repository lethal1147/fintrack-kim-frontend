import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <Image
        src="/fintrack-login-background.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="relative z-10 w-full max-w-100 flex flex-col items-center gap-6">
        <Image
          src="/fintrack-brand-logo.png"
          alt="FinTrack"
          width={160}
          height={40}
          className="h-8 w-auto"
          priority
          unoptimized
        />
        <div className="w-full bg-background/95 backdrop-blur-sm rounded-2xl border border-border shadow-sm p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
