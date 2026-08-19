export type InvitePreview = {
  workspaceName: string;
  inviterEmail: string;
  invitedEmail: string;
};

export type AcceptStatus =
  | "loading"
  | "ready"
  | "submitting"
  | "declining"
  | "success"
  | "declined"
  | "invalid"
  | "error";