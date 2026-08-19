import type { Metadata } from "next";
import { CreateWorkspaceForm } from "@/app/workspace/create/components/CreateWorkspaceForm";

export const metadata: Metadata = {
  title: "Create a workspace",
};

export default function CreateWorkspacePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <CreateWorkspaceForm />
      </div>
    </main>
  );
}