"use client";

import { useActionState } from "react";
import { t } from "@/messages";

export type ActionState = { error?: string; ok?: string };
type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function ActionForm({
  action,
  submit,
  variant = "primary",
  small,
  children,
  className = "mk-form",
}: {
  action: Action;
  submit: string;
  variant?: "primary" | "secondary";
  small?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mk-actions">
        <button
          type="submit"
          disabled={pending}
          className={`mk-btn mk-btn--${variant}${small ? " mk-btn--sm" : ""}`}
        >
          {pending ? t.portal.loading : submit}
        </button>
        {state.error && <p role="alert" className="mk-msg mk-msg--err">{state.error}</p>}
        {state.ok && <p role="status" className="mk-msg mk-msg--ok">{state.ok}</p>}
      </div>
    </form>
  );
}
