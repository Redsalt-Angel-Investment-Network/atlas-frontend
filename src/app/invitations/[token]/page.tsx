import type { Metadata } from "next";
import { AcceptInvitationCard } from "../components/AcceptInvitationCard";

export const metadata: Metadata = {
  title: "Accept invitation",
};

type AcceptInvitationProps = {
  params: Promise<{ token: string }>;
};

export default async function AcceptInvitationPage({ params }: AcceptInvitationProps) {
  const { token } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <AcceptInvitationCard token={token} />
      </div>
    </main>
  );
}