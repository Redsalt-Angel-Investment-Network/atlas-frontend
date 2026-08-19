"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AcceptStatus, InvitePreview } from "@/_types/invitations";

type Props = {
  token: string;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadInvite(token: string): Promise<InvitePreview | null> {
  await delay(400);
  if (!token || token === "expired") return null;
  return {
    workspaceName: "Atlas",
    inviterEmail: "owner@example.com",
    invitedEmail: "you@example.com",
  };
}

async function acceptInvite(token: string): Promise<void> {
  await delay(600);
  console.log("Would accept invitation:", token);
}

async function declineInvite(token: string): Promise<void> {
  await delay(600);
  console.log("Would decline invitation:", token);
}

export function AcceptInvitationCard({ token }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<AcceptStatus>("loading");
  const [invite, setInvite] = useState<InvitePreview | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatus("loading");
      setErrorMessage(null);
      try {
        const preview = await loadInvite(token);
        if (cancelled) return;
        if (!preview) {
          setInvite(null);
          setStatus("invalid");
          return;
        }
        setInvite(preview);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const busy = status === "submitting" || status === "declining";

  async function handleAccept() {
    setErrorMessage(null);
    setStatus("submitting");
    try {
      await acceptInvite(token);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  async function handleDecline() {
    setErrorMessage(null);
    setStatus("declining");
    try {
      await declineInvite(token);
      setStatus("declined");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "loading") {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-gray-500">Loading invitation…</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center"
        role="alert"
      >
        <h1 className="text-lg font-semibold text-gray-900">
          Invalid or expired invitation
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          This invitation link is no longer valid. Ask the workspace owner to
          send a new one.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center"
        role="alert"
      >
        <h1 className="text-lg font-semibold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {errorMessage ?? "Please try again."}
        </p>
        {invite && (
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setStatus("ready");
            }}
            className="mt-5 inline-flex w-full items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (status === "success" && invite) {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">You&apos;re in</h1>
        <p className="mt-1 text-sm text-gray-600">
          You joined{" "}
          <span className="font-medium text-gray-900">
            {invite.workspaceName}
          </span>
          .
        </p>
        <button
          type="button"
          autoFocus
          onClick={() => router.push("/workspace")}
          className="mt-5 inline-flex w-full items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          Go to workspace
        </button>
      </div>
    );
  }

  if (status === "declined" && invite) {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
        role="status"
        aria-live="polite"
      >
        <h1 className="text-lg font-semibold text-gray-900">
          Invitation declined
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          You declined the invite to join{" "}
          <span className="font-medium text-gray-900">
            {invite.workspaceName}
          </span>
          .
        </p>
      </div>
    );
  }

  if (!invite) return null;

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      aria-labelledby="accept-invite-title"
    >
      <h1
        id="accept-invite-title"
        className="text-lg font-semibold text-gray-900"
      >
        Join {invite.workspaceName}
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        <span className="font-medium text-gray-900">{invite.inviterEmail}</span>{" "}
        invited you to join this workspace.
      </p>

      <button
        type="button"
        onClick={handleAccept}
        disabled={busy}
        className="mt-5 w-full inline-flex items-center justify-center px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Accepting…" : "Accept invitation"}
      </button>
      <button
        type="button"
        onClick={handleDecline}
        disabled={busy}
        className="mt-2 w-full inline-flex items-center justify-center px-4 py-2.5 text-gray-700 text-sm font-semibold rounded-md border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "declining" ? "Declining…" : "Decline invitation"}
      </button>
    </div>
  );
}