import { beforeEach, describe, expect, it } from "vitest";
import {
  addAdmin,
  findAdminForLogin,
  getActiveAdmin,
  inviteToken,
  listAdmins,
  resetToken,
  setAdminActive,
  setPasswordWithToken,
} from "@/lib/admin-users";
import { openLocalDb } from "@/lib/local-db";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import type { Db } from "@/lib/queries";

let db: Db;
const person = { name: "Példa Anna", email: "anna@example.hu" };

beforeEach(async () => {
  db = await openLocalDb();
});

describe("admin accounts", () => {
  it("adds an admin once, without a password", async () => {
    const id = await addAdmin(db, person, "admin");
    expect(id).not.toBeNull();
    expect(await addAdmin(db, person, "admin")).toBeNull();
    expect(await listAdmins(db)).toMatchObject([{ email: person.email, active: true, has_password: false }]);
    expect((await findAdminForLogin(db, person.email))?.password_hash).toBeNull();
  });

  it("sets the password through a link that works once", async () => {
    const id = (await addAdmin(db, person, "admin")) as string;
    const first = await inviteToken(db, id);
    const second = await inviteToken(db, id);
    const hash = await hashPassword("nagyon-titkos-jelszo");
    expect(await setPasswordWithToken(db, "nem-letezo", hash)).toBeNull();
    expect(await setPasswordWithToken(db, second!.token, hash)).toBe(id);
    // Used links and the admin's other open links are dead.
    expect(await setPasswordWithToken(db, second!.token, hash)).toBeNull();
    expect(await setPasswordWithToken(db, first!.token, hash)).toBeNull();
    const login = await findAdminForLogin(db, person.email);
    expect(await verifyPassword("nagyon-titkos-jelszo", login!.password_hash as string)).toBe(true);
    expect(await verifyPassword("rossz", login!.password_hash as string)).toBe(false);
  });

  it("refuses an expired link", async () => {
    const id = (await addAdmin(db, person, "admin")) as string;
    const { token } = (await inviteToken(db, id))!;
    await db.query("update admin_password_tokens set expires_at = now() - interval '1 minute'");
    expect(await setPasswordWithToken(db, token, await hashPassword("nagyon-titkos-jelszo"))).toBeNull();
  });

  it("locks a disabled admin out everywhere", async () => {
    const id = (await addAdmin(db, person, "admin")) as string;
    const { token } = (await inviteToken(db, id))!;
    expect(await setAdminActive(db, id, false, "admin")).toBe(true);
    expect(await getActiveAdmin(db, id)).toBeNull();
    expect(await findAdminForLogin(db, person.email)).toBeNull();
    expect(await setPasswordWithToken(db, token, await hashPassword("nagyon-titkos-jelszo"))).toBeNull();
    expect(await inviteToken(db, id)).toBeNull();
    expect(await resetToken(db, person.email)).toBeNull();
    expect(await setAdminActive(db, id, true, "admin")).toBe(true);
    expect(await getActiveAdmin(db, id)).toMatchObject({ email: person.email });
  });

  it("limits password reset requests and ignores unknown addresses", async () => {
    await addAdmin(db, person, "admin");
    expect(await resetToken(db, "ismeretlen@example.hu")).toBeNull();
    expect(await resetToken(db, person.email)).not.toBeNull();
    expect(await resetToken(db, person.email)).toBeNull();
  });

  it("logs who added and disabled an admin", async () => {
    const id = (await addAdmin(db, person, "beni@example.hu")) as string;
    await setAdminActive(db, id, false, "beni@example.hu");
    const log = await db.query<{ actor: string; action: string }>("select actor, action from audit_log order by id");
    expect(log).toEqual([
      { actor: "beni@example.hu", action: "admin_user.add" },
      { actor: "beni@example.hu", action: "admin_user.disable" },
    ]);
  });

  it("keeps the new tables closed to the public API roles", async () => {
    const rows = await db.query<{ open: boolean }>(
      `select has_table_privilege('anon', t, 'select') or has_table_privilege('authenticated', t, 'select') as open
       from unnest(array['admin_users', 'admin_password_tokens']) t`,
    );
    expect(rows.every((row) => !row.open)).toBe(true);
  });
});
