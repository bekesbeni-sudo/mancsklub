import { createHash, randomBytes } from "node:crypto";
import type { Db } from "./queries";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

async function audit(db: Db, actor: string, action: string, id: string, details: unknown) {
  await db.query(
    "insert into audit_log (actor, action, entity, entity_id, details) values ($1, $2, 'admin_user', $3, $4::jsonb)",
    [actor, action, id, JSON.stringify(details)],
  );
}

export type AdminRow = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  has_password: boolean;
  last_login_at: Date | null;
};

export function listAdmins(db: Db): Promise<AdminRow[]> {
  return db.query<AdminRow>(
    `select id, email, name, active, password_hash is not null as has_password, last_login_at
     from admin_users order by created_at`,
  );
}

// Returns the new admin's id, or null when the email is already taken.
export function addAdmin(db: Db, input: { name: string; email: string }, actor: string): Promise<string | null> {
  return db.transaction(async (tx) => {
    const [row] = await tx.query<{ id: string }>(
      "insert into admin_users (email, name) values ($1, $2) on conflict (email) do nothing returning id",
      [input.email, input.name],
    );
    if (!row) return null;
    await audit(tx, actor, "admin_user.add", row.id, { email: input.email });
    return row.id;
  });
}

// Disabling also cancels open password links. The login check reads `active` on every request.
export function setAdminActive(db: Db, id: string, active: boolean, actor: string): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [row] = await tx.query<{ id: string }>(
      "update admin_users set active = $2 where id::text = $1 and active <> $2 returning id",
      [id, active],
    );
    if (!row) return false;
    if (!active) await tx.query("update admin_password_tokens set used_at = now() where admin_id = $1 and used_at is null", [row.id]);
    await audit(tx, actor, active ? "admin_user.enable" : "admin_user.disable", row.id, {});
    return true;
  });
}

async function newToken(db: Db, adminId: string, hours: number): Promise<string> {
  await db.query("delete from admin_password_tokens where admin_id = $1 and created_at < now() - interval '30 days'", [adminId]);
  const token = randomBytes(32).toString("base64url");
  await db.query(
    `insert into admin_password_tokens (admin_id, token_hash, expires_at)
     values ($1, $2, now() + make_interval(hours => $3))`,
    [adminId, hashToken(token), hours],
  );
  return token;
}

// The invitation sent from the team page: valid for a week.
export async function inviteToken(db: Db, adminId: string): Promise<{ token: string; email: string; name: string } | null> {
  const [admin] = await db.query<{ id: string; email: string; name: string }>(
    "select id, email, name from admin_users where id::text = $1 and active",
    [adminId],
  );
  if (!admin) return null;
  return { token: await newToken(db, admin.id, 24 * 7), email: admin.email, name: admin.name };
}

// "Forgot password": valid for an hour. Null for an unknown or disabled email and for too many
// requests; the caller shows the same message either way.
export async function resetToken(db: Db, email: string): Promise<string | null> {
  const [admin] = await db.query<{ id: string; last_minute: number; last_hour: number }>(
    `select a.id,
            count(*) filter (where t.created_at > now() - interval '1 minute')::int as last_minute,
            count(*) filter (where t.created_at > now() - interval '1 hour')::int as last_hour
     from admin_users a
     left join admin_password_tokens t on t.admin_id = a.id
     where a.email = $1 and a.active
     group by a.id`,
    [email],
  );
  if (!admin || admin.last_minute >= 1 || admin.last_hour >= 5) return null;
  return newToken(db, admin.id, 1);
}

// A link works once. Using one sets the password and cancels the admin's other open links.
export function setPasswordWithToken(db: Db, token: string, passwordHash: string): Promise<string | null> {
  return db.transaction(async (tx) => {
    const [row] = await tx.query<{ admin_id: string }>(
      `update admin_password_tokens t set used_at = now()
       from admin_users a
       where t.token_hash = $1 and t.used_at is null and t.expires_at > now() and a.id = t.admin_id and a.active
       returning t.admin_id`,
      [hashToken(token)],
    );
    if (!row) return null;
    await tx.query("update admin_password_tokens set used_at = now() where admin_id = $1 and used_at is null", [row.admin_id]);
    await tx.query("update admin_users set password_hash = $2, last_login_at = now() where id = $1", [row.admin_id, passwordHash]);
    await audit(tx, "self", "admin_user.set_password", row.admin_id, {});
    return row.admin_id;
  });
}

export async function findAdminForLogin(db: Db, email: string): Promise<{ id: string; password_hash: string | null } | null> {
  const [row] = await db.query<{ id: string; password_hash: string | null }>(
    "select id, password_hash from admin_users where email = $1 and active",
    [email],
  );
  return row ?? null;
}

export async function markAdminLogin(db: Db, id: string): Promise<void> {
  await db.query("update admin_users set last_login_at = now() where id = $1", [id]);
}

export async function getActiveAdmin(db: Db, id: string): Promise<{ id: string; email: string; name: string } | null> {
  const [row] = await db.query<{ id: string; email: string; name: string }>(
    "select id, email, name from admin_users where id::text = $1 and active",
    [id],
  );
  return row ?? null;
}
