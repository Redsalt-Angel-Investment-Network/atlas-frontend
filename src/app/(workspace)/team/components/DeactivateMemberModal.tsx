"use client";

import { useState } from "react";
import { AlertTriangle, UserX } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberType } from "@/_types/members";
import { useTranslations } from "next-intl";

interface DeactivateMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberType | null;
  onDeactivate?: (memberId: string) => void;
}

export function DeactivateMemberModal({
  open,
  onOpenChange,
  member,
  onDeactivate,
}: DeactivateMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("team.modals.deactivateMember");

  if (!member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onDeactivate?.(member.id);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <UserX className="h-5 w-5" />
          </div>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('subtitle')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Member Card Preview */}
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {member.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-foreground">
                {member.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {member.email}
              </span>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-xs leading-relaxed">
              {t('warning')}
            </p>
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? t('deactivating') : t('deactivate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}