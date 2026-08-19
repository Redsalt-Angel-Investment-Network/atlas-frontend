import WorkspaceSwitcher from "@/app/workspace/components/WorkspaceSwitcher";

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="w-72">
        <WorkspaceSwitcher />
      </div>
    </div>
  );
}