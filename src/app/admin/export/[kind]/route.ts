import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { getStaff } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { listClinicInterest, listWaitlist } from "@/lib/queries";

function isAuthorized(request: NextRequest): boolean {
  const password = process.env.ADMIN_EXPORT_PASSWORD;
  const header = request.headers.get("authorization");
  if (!password || !header?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const given = Buffer.from(decoded.slice(decoded.indexOf(":") + 1));
  const expected = Buffer.from(password);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: NextRequest, ctx: RouteContext<"/admin/export/[kind]">) {
  const staff = await getStaff();
  if (staff?.role !== "admin" && !isAuthorized(request)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Export", charset="UTF-8"' },
    });
  }

  const { kind } = await ctx.params;
  const db = await getDb();
  let csv: string;
  if (kind === "waitlist") {
    const rows = await listWaitlist(db);
    csv = toCsv(
      ["date", "email", "pet_name", "pets", "species", "location", "current_clinic", "package", "marketing_consent", "confirmed"],
      rows.map((r) => [
        formatDate(new Date(r.created_at)),
        r.email,
        r.pet_name,
        r.pet_count,
        r.species,
        r.location,
        r.current_clinic,
        r.package_code,
        r.marketing_consent ? "yes" : "no",
        r.confirmed_at ? formatDate(new Date(r.confirmed_at)) : "",
      ]),
    );
  } else if (kind === "clinics") {
    const rows = await listClinicInterest(db);
    csv = toCsv(
      ["date", "clinic", "contact", "email", "phone", "location", "message"],
      rows.map((r) => [
        formatDate(new Date(r.created_at)),
        r.clinic_name,
        r.contact_name,
        r.email,
        r.phone,
        r.location,
        r.message,
      ]),
    );
  } else {
    return new Response("Not found", { status: 404 });
  }

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${kind}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
