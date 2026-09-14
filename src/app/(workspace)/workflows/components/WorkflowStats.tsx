"use client";

import {
  Activity,
  AlertCircle,
  Workflow,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

type WorkflowStatsProps = {
  total: number;
  active: number;
  totalExecutions: number;
  failedRuns: number;
};

export default function WorkflowStats({
  total,
  active,
  totalExecutions,
  failedRuns,
}: WorkflowStatsProps) {
  const t = useTranslations("workflows");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="rounded-xl border bg-card p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">
            {t("kpi.totalWorkflows")}
          </span>
          <Workflow className="h-4 w-4" />
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">
            {total}
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">
            {t("kpi.activePipelines")}
          </span>
          <Activity className="h-4 w-4 text-emerald-500" />
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">
            {active}
          </span>

          <span className="text-xs text-muted-foreground">
            {t("kpi.ofTotal", { total })}
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">
            {t("kpi.totalExecutions")}
          </span>

          <Zap className="h-4 w-4 text-blue-500" />
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">
            {totalExecutions.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">
            {t("kpi.recentIssues")}
          </span>

          <AlertCircle className="h-4 w-4 text-rose-500" />
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold tracking-tight ${
              failedRuns > 0
                ? "text-rose-600"
                : ""
            }`}
          >
            {failedRuns}
          </span>

          <span className="text-xs text-muted-foreground">
            {t("kpi.workflowsFailed")}
          </span>
        </div>
      </div>
    </div>
  );
}