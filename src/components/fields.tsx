import Link from "next/link";
import { t } from "@/messages";

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink focus:border-accent";

export function Field({
  label,
  name,
  hint,
  optional,
  error,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  optional?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-muted"> ({optional})</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <FieldError name={name} error={error} />
    </div>
  );
}

export function FieldError({ name, error }: { name: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${name}-error`} className="mt-1 text-sm text-error">
      {error}
    </p>
  );
}

// Hidden from people. Bots fill it in, which lets the server ignore them.
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px]">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function PrivacyCheckbox({ checked, error }: { checked: boolean; error?: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="privacy"
          required
          defaultChecked={checked}
          aria-describedby={error ? "privacy-error" : undefined}
          className="mt-0.5 size-5 shrink-0 accent-accent"
        />
        <span>
          {t.forms.privacyBefore}
          <Link href="/adatvedelem" target="_blank" className="underline">
            {t.forms.privacyLink}
          </Link>
          {t.forms.privacyAfter}
        </span>
      </label>
      <FieldError name="privacy" error={error} />
    </div>
  );
}

export function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60 sm:w-auto"
    >
      {pending ? t.forms.sending : label}
    </button>
  );
}

export function FormNotice({ children, tone }: { children: React.ReactNode; tone: "ok" | "error" }) {
  return (
    <p
      role={tone === "ok" ? "status" : "alert"}
      className={`rounded-lg p-4 ${tone === "ok" ? "bg-sand font-semibold" : "bg-white text-error"}`}
    >
      {children}
    </p>
  );
}
