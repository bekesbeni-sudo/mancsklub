"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/components/portal";
import { requireClinic } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { LedgerError, redeem, voidRedemption } from "@/lib/ledger";
import { recordDiscountVisit, redemptionClinic } from "@/lib/portal-queries";
import { t } from "@/messages";

const p = t.portal;
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const ft = (value: string) => Number(value.replace(/\s/g, ""));

function failure(error: unknown): ActionState {
  if (error instanceof LedgerError) return { error: p.errors[error.code] };
  console.error("Clinic action failed", error);
  return { error: p.failed };
}

export async function recordService(membershipId: string, _: ActionState, form: FormData): Promise<ActionState> {
  // The clinic always comes from the login, never from the form.
  const staff = await requireClinic();
  const serviceCode = text(form, "service");
  const serviceDate = text(form, "date");
  const amount = text(form, "amount");
  if (!serviceCode || !serviceDate) return { error: p.required };
  try {
    await redeem(await getDb(), {
      membershipId,
      clinicId: staff.clinicId,
      serviceCode,
      serviceDate,
      amountFt: amount ? ft(amount) : undefined,
      actor: staff.actor,
    });
    revalidatePath(`/rendelo/tag/${membershipId}`);
    return { ok: p.clinic.member.recorded };
  } catch (error) {
    return failure(error);
  }
}

export async function voidService(
  membershipId: string,
  redemptionId: string,
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const staff = await requireClinic();
  const reason = text(form, "reason");
  if (!reason) return { error: p.required };
  try {
    const db = await getDb();
    if ((await redemptionClinic(db, redemptionId)) !== staff.clinicId) return { error: p.errors.NOT_FOUND };
    await voidRedemption(db, { redemptionId, reason, actor: staff.actor });
    revalidatePath(`/rendelo/tag/${membershipId}`);
    return {};
  } catch (error) {
    return failure(error);
  }
}

export async function recordDiscount(membershipId: string, _: ActionState, form: FormData): Promise<ActionState> {
  const staff = await requireClinic();
  const amountFt = ft(text(form, "amount"));
  const discountFt = ft(text(form, "discount"));
  const visitDate = text(form, "date");
  if (!visitDate || !Number.isInteger(amountFt) || amountFt <= 0 || !Number.isInteger(discountFt)) {
    return { error: p.required };
  }
  if (discountFt < 0 || discountFt > amountFt) return { error: p.clinic.member.discountInvalid };
  try {
    await recordDiscountVisit(await getDb(), {
      membershipId,
      clinicId: staff.clinicId,
      visitDate,
      amountFt,
      discountFt,
      actor: staff.actor,
    });
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}
