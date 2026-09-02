"use client";

import { useState, useMemo } from "react";
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
import { type EntityCategory, type EntitySummary } from "@/_types/entities";

const MOCK_CATEGORIES: EntityCategory[] = [
  { id: "cat_customer_001", name: "Customer" },
  { id: "cat_product_001", name: "Product" },
  { id: "cat_component_001", name: "Component" },
  { id: "cat_supplier_001", name: "Supplier" },
  { id: "cat_equipment_001", name: "Equipment" },
];

const MOCK_ENTITIES: EntitySummary[] = [
  {
    id: "1",
    workspace_id: "ws_abc123",
    category_id: "cat_customer_001",
    category_name: "Customer",
    schema_id: "schema_customer_001",
    schema_name: "Customer Schema",
    name: "Farida Al-Mansoori",
    reference: "ENT-001",
    attributes_preview: {
      phone: "+971-50-123-4567",
      email: "farida@example.com",
      preferred_language: "Arabic",
      account_tier: "Gold",
    },
    status: "active",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-06-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "2",
    workspace_id: "ws_abc123",
    category_id: "cat_product_001",
    category_name: "Product",
    schema_id: "schema_product_001",
    schema_name: "Product Schema",
    name: "Handmade Oak Mug",
    reference: "ENT-002",
    attributes_preview: {
      sku: "OAK-MUG-350",
      material: "oak",
      volume_ml: 350,
    },
    status: "active",
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "3",
    workspace_id: "ws_abc123",
    category_id: "cat_component_001",
    category_name: "Component",
    schema_id: "schema_component_001",
    schema_name: "Component Schema",
    name: "M32 High-Tensile Bolt",
    reference: "ENT-003",
    attributes_preview: {
      part_number: "HT-M32-200",
      torque_spec_nm: 420,
      criticality: "safety-critical",
    },
    status: "active",
    created_at: "2026-02-15T10:00:00Z",
    updated_at: "2026-02-15T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "4",
    workspace_id: "ws_abc123",
    category_id: "cat_supplier_001",
    category_name: "Supplier",
    schema_id: "schema_supplier_001",
    schema_name: "Supplier Schema",
    name: "Apex Steel Supplies",
    reference: "ENT-004",
    attributes_preview: {
      contact: "John Smith",
      payment_terms: "Net 30",
    },
    status: "active",
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "5",
    workspace_id: "ws_abc123",
    category_id: "cat_customer_001",
    category_name: "Customer",
    schema_id: "schema_customer_001",
    schema_name: "Customer Schema",
    name: "Sarah Johnson",
    reference: "ENT-005",
    attributes_preview: {
      phone: "+1-555-123-4567",
      email: "sarah@example.com",
      account_tier: "Silver",
    },
    status: "active",
    created_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-03-15T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "6",
    workspace_id: "ws_abc123",
    category_id: "cat_product_001",
    category_name: "Product",
    schema_id: "schema_product_001",
    schema_name: "Product Schema",
    name: "Premium Leather Desk Mat",
    reference: "ENT-006",
    attributes_preview: {
      sku: "LEATHER-MAT-001",
      material: "leather",
    },
    status: "archived",
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-06-01T10:00:00Z",
    deleted_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "7",
    workspace_id: "ws_abc123",
    category_id: "cat_equipment_001",
    category_name: "Equipment",
    schema_id: "schema_equipment_001",
    schema_name: "Equipment Schema",
    name: "Meridian Drilling Rig #3",
    reference: "ENT-007",
    attributes_preview: {
      location: "Gulf of Mexico",
      last_maintenance: "2026-06-01",
    },
    status: "active",
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-01T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "8",
    workspace_id: "ws_abc123",
    category_id: "cat_supplier_001",
    category_name: "Supplier",
    schema_id: "schema_supplier_001",
    schema_name: "Supplier Schema",
    name: "EcoTech Solutions",
    reference: "ENT-008",
    attributes_preview: {
      contact: "Maria Chen",
      payment_terms: "Net 45",
    },
    status: "active",
    created_at: "2026-04-15T10:00:00Z",
    updated_at: "2026-04-15T10:00:00Z",
    deleted_at: null,
  },
];

const getStatusBadgeStyle = (status: EntitySummary["status"]) => {
  switch (status) {
    case "active":
      return "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400";
    case "archived":
      return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400";
    default:
      return "";
  }
};

const COLUMN_WIDTHS = {
  select: "w-[4%]",
  entity: "w-[22%]",
  reference: "w-[10%]",
  category: "w-[12%]",
  status: "w-[10%]",
  created: "w-[12%]",
  attributes: "w-[16%]",
  actions: "w-[14%]",
};

export default function EntitiesListPage() {
  const t = useTranslations("entities");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [entities] = useState<EntitySummary[]>(MOCK_ENTITIES);
  const [categories] = useState<EntityCategory[]>(MOCK_CATEGORIES);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const statusOptions = [
    { value: "all", label: t("filters.allStatuses") },
    { value: "active", label: t("statuses.active") },
    { value: "archived", label: t("statuses.archived") },
  ];

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: t("filters.allCategories") },
      ...categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    ],
    [categories, t]
  );

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
        entity.name.toLowerCase().includes(search) ||
        entity.reference.toLowerCase().includes(search) ||
        entity.category_name.toLowerCase().includes(search) ||
        Object.values(entity.attributes_preview).some((value) =>
          String(value).toLowerCase().includes(search)
        );

      const matchesStatus =
        statusFilter === "all" || entity.status === statusFilter;

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

  const getStatusLabel = (status: string) => {
    return status === "active" ? t("statuses.active") : t("statuses.archived");
  };

  const getFirstAttribute = (entity: EntitySummary) => {
    const entries = Object.entries(entity.attributes_preview);
    if (entries.length === 0) return null;
    const [key, value] = entries[0];
    return `${key.replace(/_/g, " ")}: ${String(value)}`;
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
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm shadow-none focus-visible:ring-1"
            />
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
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
      </div>
 
      {/* Table Container */}
      <div className="rounded-md border bg-card shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-240px)]">
        {/* Fixed Header Table */}
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
                    className={`h-10 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase ${
                      COLUMN_WIDTHS[tableHeader.key]
                    } ${
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
 
        {/* Scrollable Body Table */}
        <div className="overflow-y-auto flex-1">
          <Table className="table-fixed w-full">
            <TableBody>
              {filteredEntities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center py-4">
                      <p className="font-medium">{t("noEntities")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                          ? t("noEntitiesWithFilters")
                          : t("noEntitiesEmpty")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                 filteredEntities.map((entity) => (
                  <TableRow
                    key={entity.id}
                    className={
                      selectedIds.has(entity.id)
                        ? "bg-muted/40 hover:bg-muted/50 transition-colors"
                        : "hover:bg-muted/40 transition-colors"
                    }
                  >
                    <TableCell className={`py-3 ${COLUMN_WIDTHS.select} text-center`}>
                      <Checkbox
                        checked={selectedIds.has(entity.id)}
                        onCheckedChange={() => toggleSelectOne(entity.id)}
                        aria-label={`${t("selectEntity")} ${entity.name}`}
                      />
                    </TableCell>
 
                    {/* Entity Name */}
                    <TableCell className={`py-3 ${COLUMN_WIDTHS.entity}`}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          href={`/entities/${entity.id}`}
                          className="text-sm font-medium text-foreground hover:text-orange-600 transition-colors truncate"
                        >
                          {entity.name}
                        </Link>
                      </div>
                    </TableCell>
 
                    {/* Reference */}
                    <TableCell className={`py-3 ${COLUMN_WIDTHS.reference}`}>
                      <code className="text-[11px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded w-fit">
                        {entity.reference}
                      </code>
                    </TableCell>
 
                    <TableCell className={`py-3 ${COLUMN_WIDTHS.category}`}>
                      <Badge variant="outline" className="font-normal text-xs">
                        {entity.category_name}
                      </Badge>
                    </TableCell>
 
                    {/* Status */}
                    <TableCell className={`py-3 ${COLUMN_WIDTHS.status}`}>
                      <Badge
                        variant="outline"
                        className={`capitalize text-xs font-medium ${getStatusBadgeStyle(
                          entity.status
                        )}`}
                      >
                        {getStatusLabel(entity.status)}
                      </Badge>
                    </TableCell>
 
                    {/* Created Date */}
                    <TableCell className={`py-3 ${COLUMN_WIDTHS.created}`}>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>{formatDate(entity.created_at)}</span>
                      </div>
                    </TableCell>
 
                    {/* Attributes Preview */}
                    <TableCell className={`py-3 ${COLUMN_WIDTHS.attributes}`}>
                      {getFirstAttribute(entity) ? (
                        <span className="text-xs text-muted-foreground truncate block">
                          {getFirstAttribute(entity)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">
                          {t("noAttributes")}
                        </span>
                      )}
                    </TableCell>
 
                    {/* Actions */}
                    <TableCell className={`py-3 ${COLUMN_WIDTHS.actions} text-center`}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">
                              {t("actions.srLabel")}
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            asChild
                            className="gap-2 cursor-pointer text-xs"
                          >
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}