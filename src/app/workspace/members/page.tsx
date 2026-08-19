"use client";

import { useState } from "react";
import { InviteMemberModal } from "@/app/workspace/members/components/InviteMemberModal";

export default function MembersPage() {
  const [inviteOpen, setInviteOpen] = useState(true);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <InviteMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </main>
  );
}