import { SiteFooter, SiteHeader } from "@/components/landing/chrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pw flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
