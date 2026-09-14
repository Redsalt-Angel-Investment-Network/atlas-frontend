"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Plus,
  Workflow,
  MoreHorizontal,
  Pencil,
  Trash2,
  Layers,
  Play,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Activity,
  GitFork,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  CreateWorkflowPayload,
  TriggerType,
  WorkflowType,
} from "@/_types/workflows";
import WorkflowStats from "./components/WorkflowStats";
import WorkflowFilters from "./components/WorkflowFilters";
import { CreateWorkflowDrawer } from "./components/CreateWorkflowDrawer";
import { createWorkflowApi, getWorkflowsApi } from "./index";

export default function WorkflowsListPage() {
  const t = useTranslations("workflows");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [triggerFilter, setTriggerFilter] = useState<string>("all");
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false);

  const handleCreateWorkflow = async (
    data: CreateWorkflowPayload,
  ): Promise<void> => {
    try {
      const newWorkflow = await createWorkflowApi(data);

      setWorkflows((prev: WorkflowType[]) => [newWorkflow, ...prev]);

      setOpenCreateDrawer(false);

      toast.success(t("createDrawer.toast.success"));
    } catch (err) {
      toast.error(t("createDrawer.toast.error"));
      throw err;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadWorkflows = async () => {

      setLoading(true);
      setError(null);

      try {
        const data = await getWorkflowsApi();

        if (!cancelled) {
          setWorkflows(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load workflows",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWorkflows();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filtered workflows computation
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        wf.name.toLowerCase().includes(search) ||
        wf.reference.toLowerCase().includes(search) ||
        wf.description.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && wf.is_active) ||
        (statusFilter === "inactive" && !wf.is_active);

      const matchesTrigger = true;

      return matchesSearch && matchesStatus && matchesTrigger;
    });
  }, [workflows, searchTerm, statusFilter, triggerFilter]);

  // Statistics calculation for KPI Header
  const metrics = useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter((w) => w.is_active).length;
    const totalExecutions = workflows.reduce((acc, w) => acc + w.version, 0);
    const failedRuns = workflows.filter((w) => w.last_run_status === "failed")
      .length;
    return { total, active, totalExecutions, failedRuns };
  }, [workflows]);

  const getStatusBadgeStyle = (isActive: boolean) => {
    if (isActive) {
      return "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400";
    }
    return "border-destructive/30 text-destructive bg-destructive/10";
  };

  const getTriggerBadge = (trigger?: TriggerType) => {
    switch (trigger) {
      case "webhook":
        return {
          label: t("trigger.webhook"),
          icon: Zap,
          class: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
        };
      case "schedule":
        return {
          label: t("trigger.schedule"),
          icon: Clock,
          class: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
        };
      case "event":
        return {
          label: t("trigger.event"),
          icon: GitFork,
          class: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
        };
      case "manual":
        return {
          label: t("trigger.manual"),
          icon: Play,
          class: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
        };
      default:
        return {
          label: t("trigger.event"),
          icon: GitFork,
          class: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
        };
    }
  };

  const getRunStatusIcon = (status: string | null) => {
    switch (status) {
      case "success":
        return (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        );
      case "failed":
        return <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />;
      case "running":
        return (
          <Activity className="h-3.5 w-3.5 text-blue-500 animate-spin shrink-0" />
        );
      default:
        return (
          <PauseCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        );
    }
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return t("table.never");
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t("table.justNow");
    if (diffInSeconds < 3600)
      return t("table.minutesAgo", { count: Math.floor(diffInSeconds / 60) });
    if (diffInSeconds < 86400)
      return t("table.hoursAgo", { count: Math.floor(diffInSeconds / 3600) });
    return date.toLocaleDateString();
  };

  const tableHeaders = [
    { label: t("table.workflow"), className: "w-[300px]" },
    { label: t("table.trigger"), className: "w-[130px]" },
    { label: t("table.steps"), className: "w-[100px]" },
    { label: t("table.status"), className: "w-[120px]" },
    { label: t("table.lastRun"), className: "w-[160px]" },
    { label: t("table.actions"), className: "w-[100px] text-right" },
  ];

  return (
    <div className="p-6 pt-0 max-w-10xl mx-auto space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {t("title")}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <Button
          onClick={() => setOpenCreateDrawer(true)}
          className="font-medium gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("createWorkflow")}
        </Button>
      </div>

      {/* KPI Stats Bar */}
      <WorkflowStats
        total={metrics.total}
        active={metrics.active}
        totalExecutions={metrics.totalExecutions}
        failedRuns={metrics.failedRuns}
      />

      {/* Filters & Search Toolbar */}
      <WorkflowFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        triggerFilter={triggerFilter}
        setTriggerFilter={setTriggerFilter}
      />

      {/* Table Container */}
      <div className="rounded-md border bg-card shadow-xs overflow-hidden flex flex-col max-h-[calc(100vh-240px)]">
        {/* Fixed Header Table */}
        <div className="border-b bg-muted/40 shrink-0">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-0">
                {tableHeaders.map((header) => (
                  <TableHead
                    key={header.label}
                    className={`h-10 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase ${header.className ||
                      ""}`}
                  >
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable Body Table */}
        <div className="overflow-y-auto flex-1">
          <Table className="table-fixed w-full">
            <TableBody>
              {filteredWorkflows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center py-6">
                      <Workflow className="h-10 w-10 text-muted-foreground/40 mb-3 stroke-1" />
                      <p className="font-medium text-foreground">
                        {t("emptyState.title")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        triggerFilter !== "all"
                          ? t("emptyState.searchNoResults")
                          : t("emptyState.noData")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkflows.map((workflow) => {
                  const triggerInfo = getTriggerBadge();
                  const TriggerIcon = triggerInfo.icon;

                  return (
                    <TableRow
                      key={workflow.id}
                      className="hover:bg-muted/40 transition-colors "
                    >
                      {/* Workflow Name & Reference */}
                      <TableCell className="py-3 w-[300px]">
                        <div className="flex flex-col gap-1 min-w-0">
                          <Link
                            href={`/workflows/${workflow.id}`}
                            className="text-sm font-semibold text-foreground hover:text-orange-600 transition-colors truncate flex items-center gap-1.5"
                          >
                            <span>{workflow.name}</span>
                            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-600" />
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono truncate">
                              {workflow.reference}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Trigger Type */}
                      <TableCell className="py-3 w-[130px]">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className={`px-2 py-0.5 font-normal text-xs flex items-center gap-1 rounded-md border-0 ${triggerInfo.class}`}
                          >
                            <TriggerIcon className="h-3 w-3" />
                            <span>{triggerInfo.label}</span>
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Version / Steps */}
                      <TableCell className="py-3 w-[100px]">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Layers className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>
                            {t("table.stepsCount", {
                              count: workflow.version,
                            })}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="py-3 w-[120px]">
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs font-medium ${getStatusBadgeStyle(
                            workflow.is_active,
                          )}`}
                        >
                          {workflow.is_active
                            ? t("status.active")
                            : t("status.inactive")}
                        </Badge>
                      </TableCell>

                      {/* Last Run Status & Time */}
                      <TableCell className="py-3 w-[160px]">
                        <div className="flex items-center gap-2">
                          {getRunStatusIcon(
                            workflow.is_active ? "success" : "idle",
                          )}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-foreground capitalize">
                              {workflow.is_active
                                ? t("executionStatus.success")
                                : t("table.neverRun")}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {formatRelativeTime(workflow.updated_at)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Actions Menu */}
                      <TableCell className="py-3 w-[100px] text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">
                                  {t("table.actions")}
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{t("actions.edit")}</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>{t("actions.delete")}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateWorkflowDrawer
        isOpen={openCreateDrawer}
        onOpenChange={setOpenCreateDrawer}
        onSubmitApi={handleCreateWorkflow}
      />
    </div>
  );
}