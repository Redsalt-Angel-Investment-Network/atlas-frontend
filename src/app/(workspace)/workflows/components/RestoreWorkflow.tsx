"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcw, AlertCircle, ArchiveRestore } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RestoreArchivedWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowName?: string;
  workflowReference?: string;
  onConfirmRestore: () => Promise<void>;
}

export const RestoreArchivedWorkflowModal: React.FC<RestoreArchivedWorkflowModalProps> = ({
  isOpen,
  onClose,
  workflowName,
  workflowReference,
  onConfirmRestore,
}) => {
  const t = useTranslations("workflows.restoreModal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRestore = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmRestore();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <ArchiveRestore className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                {t("title")}
              </DialogTitle>
              <span className="text-xs font-mono text-muted-foreground">
                {workflowReference}
              </span>
            </div>
          </div>
          <DialogDescription className="pt-2 text-xs leading-relaxed text-muted-foreground">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-lg border bg-muted/30 p-3 flex items-start gap-3 text-xs text-foreground">
          <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{workflowName}</p>
            <p className="text-muted-foreground mt-0.5">{t("restoreNotice")}</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleRestore}
            disabled={isSubmitting}
            className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {isSubmitting ? t("restoring") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};