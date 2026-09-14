"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type WorkflowFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  triggerFilter: string;
  setTriggerFilter: (value: string) => void;
};

export default function WorkflowFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  triggerFilter,
  setTriggerFilter,
}: WorkflowFiltersProps) {
  const t = useTranslations("workflows");

  const statusOptions = [
    { value: "all", label: t("status.all") },
    { value: "active", label: t("status.active") },
    { value: "inactive", label: t("status.inactive") },
  ];

  const triggerOptions = [
    { value: "all", label: t("trigger.all") },
    { value: "webhook", label: t("trigger.webhook") },
    { value: "schedule", label: t("trigger.schedule") },
    { value: "event", label: t("trigger.event") },
    { value: "manual", label: t("trigger.manual") },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />

          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm shadow-none focus-visible:ring-1"
          />
        </div>

        {/* Status Select */}
        <div className="w-full sm:w-36">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full h-9 text-sm shadow-none focus:ring-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trigger Type Select */}
        <div className="w-full sm:w-36">
          <Select
            value={triggerFilter}
            onValueChange={(value) => setTriggerFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full h-9 text-sm shadow-none focus:ring-1">
              <SelectValue placeholder="Trigger" />
            </SelectTrigger>

            <SelectContent>
              {triggerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}