"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, FolderTree, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/_types/category";

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType | null;
  onDelete?: (categoryId: string) => Promise<void>;
}

export function DeleteCategoryModal({
  open,
  onOpenChange,
  category,
  onDelete,
}: DeleteCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("categories.modals.deleteCategory");

  const handleConfirm = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!category) return;

    setIsSubmitting(true);

    try {
      await onDelete?.(category.id);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Trash2 className="h-5 w-5" />
          </div>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="space-y-4 pt-2">
          {/* Category Card Preview */}
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderTree className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-sm font-semibold text-foreground">
                {category.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono truncate">{category.slug}</span>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-xs leading-relaxed">{t("warning")}</p>
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}