"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  inviteMemberSchema,
  type InviteMemberInput,
  type InviteMemberErrors,
} from "@/app/workspace/members/schema";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function InviteMemberModal({ open, onClose }: Props) {
  const [values, setValues] = useState<InviteMemberInput>({ email: "" });
  const [errors, setErrors] = useState<InviteMemberErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Reset form state each time the modal is opened fresh
  useEffect(() => {
    if (open) {
      setValues({ email: "" });
      setErrors({});
      setStatus("idle");
      setServerError(null);
      const t = setTimeout(() => emailInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleChange(value: string) {
    setValues({ email: value });
    setErrors({});
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const result = inviteMemberSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: InviteMemberErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof InviteMemberInput;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");

    try {
      console.log("Would invite:", result.data);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
    } catch {
      setStatus("error");
      setServerError("Something went wrong. Please try again.");
    }
  }

  function handleInviteAnother() {
    setValues({ email: "" });
    setStatus("idle");
    setTimeout(() => emailInputRef.current?.focus(), 0);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
      >
        {status === "success" ? (
          <div className="text-center" role="status" aria-live="polite">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Invitation sent</h2>
            <p className="mt-1 text-sm text-gray-600">
              We&apos;ve emailed an invite to{" "}
              <span className="font-medium text-gray-900">{values.email}</span>.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
              <button
                onClick={handleInviteAnother}
                className="inline-flex items-center justify-center px-4 py-2 text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Invite another
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 id="invite-modal-title" className="text-lg font-semibold text-gray-900">
                  Invite a member
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  They&apos;ll receive an email invite to join this workspace.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1 p-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-5">
              <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="invite-email"
                ref={emailInputRef}
                type="email"
                value={values.email}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="teammate@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "invite-email-error" : undefined}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p id="invite-email-error" className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}

              {serverError && (
                <p className="mt-3 text-sm text-red-600" role="alert">
                  {serverError}
                </p>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Sending…" : "Send invite"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}