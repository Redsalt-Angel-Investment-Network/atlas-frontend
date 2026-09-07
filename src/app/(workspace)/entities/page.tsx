"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Calendar,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { type Entity } from "@/_types/entities";
import { getEntitiesApi } from "@/app/(workspace)/entities/index";
import { getCategoryApi } from "@/app/(workspace)/categories/index";
import { CategoryType } from "@/_types/category";

const COLUMN_WIDTHS = {
  select: "w-[4%]",
  entity: "w-[18%]",
  reference: "w-[13%]",
  category: "w-[13%]",
  status: "w-[11%]",
  created: "w-[12%]",
  attributes: "w-[15%]",
  actions: "w-[14%]",
};

const getStatusBadgeStyle = (isArchived: boolean) => {
  return isArchived
    ? "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
    : "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400";
};

export default function EntitiesListPage() {
  const t = useTranslations("entities");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  

  const fetchEntities = (categoryId?: string) => {
    return getEntitiesApi(categoryId);
  };

  const fetchCategories = () => {
    return getCategoryApi();
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [entities, categories] = await Promise.all([
          fetchEntities(),
          fetchCategories(),
        ]);

        setEntities(entities);
        setCategories(categories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const statusOptions = [
    { value: "all", label: t("filters.allStatuses") },
    { value: "active", label: t("statuses.active") },
    { value: "archived", label: t("statuses.archived") },
  ];

  const tableHeaders = [
    { key: "entity", label: t("table.entity") },
    { key: "reference", label: t("table.reference") },
    { key: "category", label: t("table.category") },
    { key: "status", label: t("table.status") },
    { key: "created", label: t("table.created") },
    { key: "attributes", label: t("table.attributes") },
    { key: "actions", label: t("table.actions") },
  ] as const;

  const filteredEntities = useMemo(() => {
    return entities.filter((entity) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        entity.category_id.toLowerCase().includes(search) ||
        entity.reference.toLowerCase().includes(search) ||
        entity.attributes.some((attr) =>
          String(attr.value).toLowerCase().includes(search)
        );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !entity.deleted_at) ||
        (statusFilter === "archived" && Boolean(entity.deleted_at));

      const matchesCategory =
        categoryFilter === "all" || entity.category_id === categoryFilter;


      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [entities, searchTerm, statusFilter, categoryFilter]);

  const allVisibleSelected =
    filteredEntities.length > 0 &&
    filteredEntities.every((entity) => selectedIds.has(entity.id));

  const someVisibleSelected =
    !allVisibleSelected &&
    filteredEntities.some((entity) => selectedIds.has(entity.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (allVisibleSelected) return new Set();
      const next = new Set(prev);
      filteredEntities.forEach((entity) => next.add(entity.id));
      return next;
    });
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFirstAttribute = (entity: Entity) => {
    const [first] = entity.attributes || [];
    if (!first) return null;

    const fieldLabel =
      typeof first.field === "string"
        ? first.field.replace(/_/g, " ")
        : "attribute";
    return `${fieldLabel}: ${String(first.value)}`;
  };

  const getCategoryById = (categoryId: string,): CategoryType | undefined => {
    return categories.find((category) => category.id === categoryId);
  };

  return (
    <div className="p-6 pt-0 max-w-10xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/entities/new">
            <Plus className="h-4 w-4" />
            {t("newEntity")}
          </Link>
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm shadow-none focus-visible:ring-1"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-36">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full h-9 text-sm shadow-none focus:ring-1">
                <SelectValue placeholder={t("filters.allStatuses")} />
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

          {/* Category Filter */}
          <div className="w-full sm:w-36">
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full h-9 text-sm shadow-none focus:ring-1">
                <SelectValue placeholder={t("filters.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.allCategories")}
                </SelectItem>

                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md border bg-card shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-240px)]">
        <div className="border-b bg-card shrink-0">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-0">
                <TableHead className={`h-10 ${COLUMN_WIDTHS.select} text-center`}>
                  <Checkbox
                    checked={
                      allVisibleSelected
                        ? true
                        : someVisibleSelected
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label={t("selectAll")}
                  />
                </TableHead>
                {tableHeaders.map((tableHeader) => (
                  <TableHead
                    key={tableHeader.key}
                    className={`h-10 ${COLUMN_WIDTHS[tableHeader.key]} text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase ${
                      tableHeader.key === "actions" ? "text-center" : ""
                    }`}
                  >
                    {tableHeader.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="overflow-y-auto flex-1">
          <Table className="table-fixed w-full">
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                    {t("loading")}
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-sm text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredEntities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center justify-center py-4">
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {searchTerm || statusFilter !== "all"
                          ? t("noEntitiesWithFilters")
                          : t("noEntitiesEmpty")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntities.map((entity) => {
                  const preview = getFirstAttribute(entity);
                  const categoryName = getCategoryById(entity.category_id)?.name || t("unknownCategory");
                  return (
                    <TableRow
                      key={entity.id}
                      className={
                        selectedIds.has(entity.id)
                          ? "bg-muted/40 hover:bg-muted/50 transition-colors"
                          : "hover:bg-muted/40 transition-colors"
                      }
                    >
                      <TableCell className={`py-3 text-center ${COLUMN_WIDTHS.select}`}>
                        <Checkbox
                          checked={selectedIds.has(entity.id)}
                          onCheckedChange={() => toggleSelectOne(entity.id)}
                          aria-label={`${t("selectEntity")} ${entity.name}`}
                        />
                      </TableCell>

                      <TableCell className={`py-3 ${COLUMN_WIDTHS.entity}`}>
                        <Link
                          href={`/entities/${entity.id}`}
                          className={`text-sm font-medium text-foreground hover:text-orange-600 transition-colors truncate block`}
                        >
                          {entity.name}
                        </Link>
                      </TableCell>

                      <TableCell className={`py-3 ${COLUMN_WIDTHS.reference}`}>
                        <code className={`text-[11px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded truncate block max-w-full`}>
                          {entity.reference}
                        </code>
                      </TableCell>

                      <TableCell className={`py-3 ${COLUMN_WIDTHS.category}`}>
                        <Badge
                          variant="outline"
                          className={`font-normal text-xs truncate max-w-full block`}
                          title={categoryName}
                        >
                          {categoryName}
                        </Badge>
                      </TableCell>

                      <TableCell className={`py-3 ${COLUMN_WIDTHS.status} text-cendter `}>
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs font-medium whitespace-nowrap ${
                            entity.deleted_at
                              ? "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                              : "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400"
                          }`}
                        >
                          {entity.deleted_at ? t("statuses.archived") : t("statuses.active")}
                        </Badge>
                      </TableCell>

                      <TableCell className={`py-3 ${COLUMN_WIDTHS.created}`}>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span>{formatDate(entity.created_at)}</span>
                        </div>
                      </TableCell>

                      <TableCell className={`py-3 ${COLUMN_WIDTHS.attributes}`}>
                        {preview ? (
                          <span className="text-xs text-muted-foreground truncate block">
                            {preview}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">
                            {t("noAttributes")}
                          </span>
                        )}
                      </TableCell>

                      <TableCell className={`py-3 text-center ${COLUMN_WIDTHS.actions}`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t("actions.srLabel")}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem asChild className="gap-2 cursor-pointer text-xs">
                              <Link href={`/entities/${entity.id}`}>
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{t("detail.viewDetails")}</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{t("actions.edit")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{t("actions.duplicate")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>{t("actions.archive")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}