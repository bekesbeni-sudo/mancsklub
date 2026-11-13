import "server-only";
import { headers } from "next/headers";
import { site } from "@/config/site";

// In production the address is fixed, so a forged Host header cannot end up in an email.
export async function baseUrl(): Promise<string> {
  if (process.env.NODE_ENV === "production") return `https://${site.domain}`;
  return `http://${(await headers()).get("host")}`;
}

export async function passwordLinkUrl(token: string): Promise<string> {
  return `${await baseUrl()}/belepes/jelszo?token=${token}`;
}
