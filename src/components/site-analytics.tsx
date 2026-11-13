"use client";

import { Analytics } from "@vercel/analytics/next";
import { publicPageUrl } from "@/lib/analytics";

export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = publicPageUrl(event.url);
        return url ? { ...event, url } : null;
      }}
    />
  );
}
