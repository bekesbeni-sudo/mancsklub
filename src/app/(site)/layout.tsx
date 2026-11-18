import { SiteFooter } from "@/components/landing/chrome";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pw flex min-h-full flex-1 flex-col">
      <LandingHeader prefix="/" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
