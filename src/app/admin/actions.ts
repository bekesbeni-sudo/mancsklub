"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/components/portal";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  cancelMembership,
  createMembership,
  LedgerError,
  lockSettlement,
  markSettlementPaid,
  setPrice,
} from "@/lib/ledger";
import { addPet, clinicFromInterest, markSignupConverted, petBelongsTo, updateOwner, updatePet } from "@/lib/admin-queries";
import { hashPassword } from "@/lib/passwords";
import { enrollMember } from "@/lib/portal-queries";
import { t } from "@/messages";

const p = t.portal;
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const optional = (form: FormData, key: string) => text(form, key) || null;

function failure(error: unknown): ActionState {
  if (error instanceof LedgerError) return { error: p.errors[error.code] };
  if ((error as { code?: string }).code === "23505") return { error: p.duplicate };
  console.error("Admin action failed", error);
  return { error: p.failed };
}

function clinicValues(form: FormData) {
  const discount = text(form, "discount");
  return [
    text(form, "name"),
    text(form, "status") || "prospect",
    discount === "" ? null : Number(discount.replace(",", ".")),
    optional(form, "address"),
    optional(form, "town"),
    optional(form, "district"),
    optional(form, "contactName"),
    optional(form, "contactEmail"),
    optional(form, "contactPhone"),
    optional(form, "notes"),
  ];
}

async function auditClinic(actor: string, action: string, id: string, values: unknown[]) {
  const db = await getDb();
  await db.query(
    "insert into audit_log (actor, action, entity, entity_id, details) values ($1, $2, 'clinic', $3, $4::jsonb)",
    [actor, action, id, JSON.stringify({ name: values[0], status: values[1], discount: values[2] })],
  );
}

export async function createClinic(_: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  if (!text(form, "name")) return { error: p.required };
  let id: string;
  try {
    const db = await getDb();
    const values = clinicValues(form);
    const [row] = await db.query<{ id: string }>(
      `insert into clinics (name, contract_status, discount_percent, address, town, district,
         contact_name, contact_email, contact_phone, notes)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
      values,
    );
    id = row.id;
    await auditClinic(actor, "clinic.create", id, values);
  } catch (error) {
    return failure(error);
  }
  redirect(`/admin/rendelok/${id}`);
}

export async function updateClinic(id: string, _: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  if (!text(form, "name")) return { error: p.required };
  try {
    const db = await getDb();
    const values = clinicValues(form);
    await db.query(
      `update clinics set name = $2, contract_status = $3, discount_percent = $4, address = $5,
         town = $6, district = $7, contact_name = $8, contact_email = $9, contact_phone = $10, notes = $11
       where id = $1`,
      [id, ...values],
    );
    await auditClinic(actor, "clinic.update", id, values);
    revalidatePath(`/admin/rendelok/${id}`);
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}

export async function addPrice(clinicId: string | null, _: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  const priceFt = Number(text(form, "price").replace(/\s/g, ""));
  const validFrom = text(form, "validFrom");
  const serviceCode = text(form, "service");
  if (!serviceCode || !validFrom || !Number.isInteger(priceFt) || priceFt < 0) return { error: p.required };
  try {
    await setPrice(await getDb(), { serviceCode, clinicId: clinicId ?? undefined, priceFt, validFrom, actor });
    revalidatePath(clinicId ? `/admin/rendelok/${clinicId}` : "/admin/arak");
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}

export async function addClinicUser(clinicId: string, _: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  const name = text(form, "name");
  const email = text(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!name || !email) return { error: p.required };
  if (password.length < 10) return { error: p.admin.clinics.passwordShort };
  try {
    const db = await getDb();
    const [row] = await db.query<{ id: string }>(
      "insert into clinic_users (clinic_id, name, email, password_hash) values ($1, $2, $3, $4) returning id",
      [clinicId, name, email, await hashPassword(password)],
    );
    await db.query(
      "insert into audit_log (actor, action, entity, entity_id, details) values ($1, 'clinic_user.create', 'clinic_user', $2, $3::jsonb)",
      [actor, row.id, JSON.stringify({ clinicId, email })],
    );
    revalidatePath(`/admin/rendelok/${clinicId}`);
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}

export async function setClinicUserActive(
  clinicId: string,
  userId: string,
  active: boolean,
): Promise<ActionState> {
  const { actor } = await requireAdmin();
  try {
    const db = await getDb();
    await db.query("update clinic_users set active = $2 where id = $1 and clinic_id = $3", [userId, active, clinicId]);
    await db.query(
      "insert into audit_log (actor, action, entity, entity_id, details) values ($1, 'clinic_user.active', 'clinic_user', $2, $3::jsonb)",
      [actor, userId, JSON.stringify({ active })],
    );
    revalidatePath(`/admin/rendelok/${clinicId}`);
    return {};
  } catch (error) {
    return failure(error);
  }
}

export async function addMember(_: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  const fields = ["ownerName", "ownerEmail", "petName", "species", "package", "startedOn"];
  if (fields.some((field) => !text(form, field))) return { error: p.required };
  let id: string;
  try {
    const db = await getDb();
    id = await db.transaction(async (tx) => {
      const petId = await enrollMember(tx, {
        email: text(form, "ownerEmail").toLowerCase(),
        fullName: text(form, "ownerName"),
        phone: optional(form, "ownerPhone"),
        petName: text(form, "petName"),
        species: text(form, "species"),
        birthDate: optional(form, "birthDate"),
        microchip: optional(form, "microchip"),
      });
      const membership = await createMembership(tx, {
        petId,
        packageCode: text(form, "package"),
        startedOn: text(form, "startedOn"),
        actor,
      });
      const signupId = text(form, "signupId");
      if (signupId) await markSignupConverted(tx, signupId, membership.id);
      return membership.id;
    });
  } catch (error) {
    return failure(error);
  }
  redirect(`/admin/tagok/${id}`);
}

export async function cancelMember(id: string, _: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  const cancelledOn = text(form, "cancelledOn");
  if (!cancelledOn) return { error: p.required };
  try {
    await cancelMembership(await getDb(), { membershipId: id, cancelledOn, actor });
    revalidatePath(`/admin/tagok/${id}`);
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}

export async function lockPeriod(clinicId: string, period: string): Promise<ActionState> {
  const { actor } = await requireAdmin();
  try {
    await lockSettlement(await getDb(), { clinicId, period, actor });
    revalidatePath("/admin/elszamolas");
    return {};
  } catch (error) {
    return failure(error);
  }
}

export async function markPaid(settlementId: string): Promise<ActionState> {
  const { actor } = await requireAdmin();
  try {
    await markSettlementPaid(await getDb(), { settlementId, actor });
    revalidatePath("/admin/elszamolas");
    return {};
  } catch (error) {
    return failure(error);
  }
}

const petFields = (form: FormData) => ({
  name: text(form, "name"),
  sex: optional(form, "sex"),
  birthDate: optional(form, "birthDate"),
  breed: optional(form, "breed"),
  microchip: optional(form, "microchip"),
});

export async function saveOwner(id: string, _: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  const fullName = text(form, "fullName");
  const email = text(form, "email");
  if (!fullName || !email) return { error: p.required };
  try {
    await updateOwner(await getDb(), { id, fullName, email, phone: optional(form, "phone"), actor });
    revalidatePath(`/admin/gazdik/${id}`);
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}

export async function createPet(ownerId: string, _: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  if (!text(form, "name")) return { error: p.required };
  try {
    await addPet(await getDb(), { ...petFields(form), ownerId, species: text(form, "species"), actor });
    revalidatePath(`/admin/gazdik/${ownerId}`);
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}

export async function savePet(ownerId: string, petId: string, _: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  if (!text(form, "name")) return { error: p.required };
  try {
    const saved = await updatePet(await getDb(), { ...petFields(form), id: petId, ownerId, actor });
    if (!saved) return { error: p.errors.NOT_FOUND };
    revalidatePath(`/admin/gazdik/${ownerId}`);
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}

export async function startMembership(ownerId: string, petId: string, _: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  const packageCode = text(form, "package");
  const startedOn = text(form, "startedOn");
  if (!packageCode || !startedOn) return { error: p.required };
  try {
    const db = await getDb();
    if (!(await petBelongsTo(db, petId, ownerId))) return { error: p.errors.NOT_FOUND };
    await createMembership(db, { petId, packageCode, startedOn, actor });
    revalidatePath(`/admin/gazdik/${ownerId}`);
    return { ok: p.saved };
  } catch (error) {
    return failure(error);
  }
}

export async function addClinicFromInterest(interestId: string): Promise<void> {
  const { actor } = await requireAdmin();
  const clinicId = await clinicFromInterest(await getDb(), interestId, actor);
  redirect(clinicId ? `/admin/rendelok/${clinicId}` : "/admin/rendelok");
}
