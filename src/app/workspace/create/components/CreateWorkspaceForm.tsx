"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
  type CreateWorkspaceErrors,
} from "@/app/workspace/create/schema";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function CreateWorkspaceForm() {
  const router = useRouter();
  const [values, setValues] = useState<CreateWorkspaceInput>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<CreateWorkspaceErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(field: keyof CreateWorkspaceInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const result = createWorkspaceSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: CreateWorkspaceErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateWorkspaceInput;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");

    try {
      console.log("Would submit:", result.data);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
    } catch {
      setStatus("error");
      setServerError("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm animate-in fade-in zoom-in-95 duration-300"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-semibold text-white">
          {values.name.trim().charAt(0).toUpperCase()}
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Workspace created
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-medium text-gray-900">{values.name}</span> is
          ready to use.
        </p>
        {values.description && (
          <p className="mt-2 text-xs text-gray-500 italic">
            &ldquo;{values.description}&rdquo;
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2">
          <button
            autoFocus
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Go to dashboard
          </button>
          <button
            onClick={() => router.push("/workspace/invite")}
            className="inline-flex items-center justify-center px-4 py-2 text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Invite Members
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      noValidate
      aria-labelledby="workspace-form-title"
    >
      <h1 id="workspace-form-title" className="text-lg font-semibold text-gray-900">
        Create a workspace
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Give your workspace a name to get started.
      </p>

      <div className="mt-5">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Workspace name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Acme Inc."
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-xs text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="What's this workspace for?"
          rows={3}
          maxLength={200} 
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
           errors.description ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-xs text-red-600">
            {errors.description}
          </p>
        )}
        {values.description && (
          <p className="mt-1 text-xs text-gray-400 text-right">
            {values.description.length}/200 characters
          </p>
        )}
      </div>

      {serverError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            Creating…
          </>
        ) : (
          "Create workspace"
        )}
      </button>
    </form>
  );
}