"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Zap,
  Clock,
  GitFork,
  Play,
  Workflow,
  Info,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TriggerType, WorkflowType } from "@/_types/workflows";
import { CreateWorkflowInput, createWorkflowSchema } from "../schema";

interface CreateWorkflowDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitApi: (payload: WorkflowType) => Promise<void>;
}

const TRIGGER_OPTIONS: {
  id: TriggerType;
  titleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  badgeClass: string;
  iconColor: string;
}[] = [
  {
    id: "webhook",
    titleKey: "triggerOptions.webhook.title",
    descriptionKey: "triggerOptions.webhook.description",
    icon: Zap,
    badgeClass:
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
    iconColor: "text-blue-500",
  },
  {
    id: "schedule",
    titleKey: "triggerOptions.schedule.title",
    descriptionKey: "triggerOptions.schedule.description",
    icon: Clock,
    badgeClass:
      "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900",
    iconColor: "text-purple-500",
  },
  {
    id: "event",
    titleKey: "triggerOptions.event.title",
    descriptionKey: "triggerOptions.event.description",
    icon: GitFork,
    badgeClass:
      "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900",
    iconColor: "text-indigo-500",
  },
  {
    id: "manual",
    titleKey: "triggerOptions.manual.title",
    descriptionKey: "triggerOptions.manual.description",
    icon: Play,
    badgeClass:
      "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
    iconColor: "text-amber-500",
  },
];

export function CreateWorkflowDrawer({
  isOpen,
  onOpenChange,
  onSubmitApi,
}: CreateWorkflowDrawerProps) {
  const t = useTranslations("workflows");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkflowInput>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
      triggerType: "webhook",
      cronExpression: "0 0 * * *",
      eventKey: "user.created",
    },
    mode: "onBlur",
  });

  const name = watch("name");
  const triggerType = watch("triggerType");

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Helper to resolve a Zod message key through next-intl
  const errMsg = (key?: string) =>
    key ? t(`createDrawer.validation.${key}` as never) : undefined;

  const onSubmit = async (values: CreateWorkflowInput) => {
    await onSubmitApi((values as unknown) as WorkflowType);
    onOpenChange(false);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={handleDrawerOpenChange}>
      <SheetContent className="sm:max-w-3xl w-full p-0 flex flex-col h-full">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Workflow className="h-5 w-5 text-primary" />{" "}
            {t("createDrawer.title")}
          </SheetTitle>
          <SheetDescription>{t("createDrawer.description")}</SheetDescription>
        </SheetHeader>

        {/* Form Body - Scrollable */}
        <form
          id="create-workflow-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Workflow Name */}
          <div className="space-y-1.5">
            <Label htmlFor="wf-name" className="text-xs font-semibold">
              {t("createDrawer.form.name.label")}{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="wf-name"
              placeholder={t("createDrawer.form.name.placeholder")}
              maxLength={80}
              {...register("name")}
              className={`h-9 text-sm ${
                errors.name ? "border-destructive" : ""
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-destructive">
                {errMsg(errors.name.message)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="wf-description" className="text-xs font-semibold">
              {t("createDrawer.form.description.label")}
            </Label>
            <Textarea
              id="wf-description"
              placeholder={t("createDrawer.form.description.placeholder")}
              maxLength={250}
              {...register("description")}
              className={`min-h-[80px] text-sm resize-none ${
                errors.description ? "border-destructive" : ""
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-destructive">
                {errMsg(errors.description.message)}
              </p>
            )}
          </div>

          {/* Trigger Selection */}
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-xs font-semibold">
                {t("createDrawer.form.trigger.label")}{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <p className="text-[11px] text-muted-foreground">
                {t("createDrawer.form.trigger.hint")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {TRIGGER_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = triggerType === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() =>
                      setValue("triggerType", option.id, {
                        shouldValidate: true,
                      })
                    }
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? "border-orange-500/80 bg-orange-500/[0.03] dark:bg-orange-500/[0.05] ring-1 ring-orange-500/50"
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? option.badgeClass
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          {t(option.titleKey)}
                        </span>
                        {isSelected && (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-bold border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20"
                          >
                            {t("createDrawer.form.trigger.selected")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {t(option.descriptionKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.triggerType && (
              <p className="text-[11px] text-destructive">
                {errMsg(errors.triggerType.message)}
              </p>
            )}
          </div>

          {/* Dynamic Trigger Config Preview */}
          <div className="p-3.5 rounded-lg border bg-muted/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <Info className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              <span>{t("createDrawer.form.triggerConfig.title")}</span>
            </div>

            {triggerType === "webhook" && (
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground font-mono">
                  {t("createDrawer.form.triggerConfig.webhook.endpointLabel")}
                </Label>
                <div className="p-2 rounded bg-background border font-mono text-[11px] text-muted-foreground truncate">
                  https://api.yourdomain.com/v1/hooks/wf_
                  {name ||
                    t(
                      "createDrawer.form.triggerConfig.webhook.endpointFallback",
                    )}
                </div>
              </div>
            )}

            {triggerType === "schedule" && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="cron-input"
                  className="text-[11px] text-muted-foreground"
                >
                  {t("createDrawer.form.triggerConfig.schedule.cronLabel")}
                </Label>
                <Input
                  id="cron-input"
                  {...register("cronExpression")}
                  className={`h-8 font-mono text-xs bg-background ${
                    errors.cronExpression ? "border-destructive" : ""
                  }`}
                  placeholder="0 0 * * *"
                />
                {errors.cronExpression ? (
                  <p className="text-[10px] text-destructive">
                    {errMsg(errors.cronExpression.message)}
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground">
                    {t("createDrawer.form.triggerConfig.schedule.cronHint")}
                  </p>
                )}
              </div>
            )}

            {triggerType === "event" && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="event-input"
                  className="text-[11px] text-muted-foreground"
                >
                  {t("createDrawer.form.triggerConfig.event.eventLabel")}
                </Label>
                <Input
                  id="event-input"
                  {...register("eventKey")}
                  className={`h-8 font-mono text-xs bg-background ${
                    errors.eventKey ? "border-destructive" : ""
                  }`}
                  placeholder="order.created"
                />
                {errors.eventKey && (
                  <p className="text-[10px] text-destructive">
                    {errMsg(errors.eventKey.message)}
                  </p>
                )}
              </div>
            )}

            {triggerType === "manual" && (
              <p className="text-[11px] text-muted-foreground">
                {t("createDrawer.form.triggerConfig.manual.hint")}
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-card shrink-0 gap-2 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={isSubmitting}
            onClick={() => handleDrawerOpenChange(false)}
          >
            {t("createDrawer.buttons.cancel")}
          </Button>
          <Button
            type="submit"
            form="create-workflow-form"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{t("createDrawer.buttons.creating")}</span>
              </>
            ) : (
              <span>{t("createDrawer.buttons.create")}</span>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}