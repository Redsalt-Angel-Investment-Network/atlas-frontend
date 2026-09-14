"use client";

import { useState } from "react";
import { InviteMemberModal } from "@/app/workspace/members/components/InviteMemberModal";

export default function MembersPage() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {inviteOpen && (
        <InviteMemberModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
        />
      )}

      <button
        onClick={() => setInviteOpen(true)}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
      >
        Invite member
      </button>
    </main>
  );
}