"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Plus,
  Search,
  FolderTree,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Calendar,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryType, CreateCategoryPayload } from "@/_types/category";
import { createCategoryApi, getCategoryApi } from "@/app/(workspace)/index";
import { CreateCategoryDrawer } from "./components/CreateCategoryForm";
import { toast } from "sonner";




export default function SchemasListPage() {
  const t = useTranslations("categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreateCategoryDrawer, setopenCreateCategoryDrawer] = useState(false);

  const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      getCategoryApi()
        .then(setCategories)
        .catch((err) => setError(err.message ?? "Failed to load categories"))
        .finally(() => setLoading(false));
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);

  const handleCreateCategory = async (
    data: CreateCategoryPayload,
  ): Promise<void> => {
    try {
      const newCategory = await createCategoryApi(data);

      setCategories((prev: CategoryType[]) => [newCategory, ...prev]);

      setopenCreateCategoryDrawer(false);

      toast.success(t("createCategoryForm.toast.success"));
    } catch (err: any) {
      toast.error(t("createCategoryForm.toast.error"));

      throw err;
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        category.name.toLowerCase().includes(search) ||
        category.slug.toLowerCase().includes(search) ||
        category.description.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.is_active === true) ||
        (statusFilter === "inactive" && category.is_active === false);

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const getStatusBadgeStyle = (isActive: boolean) => {
    if (isActive) {
      return "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400";
    }
    return "border-destructive/30 text-destructive bg-destructive/10";
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? t("status.active") : t("status.inactive");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; 
  };


  const filters = {
    status: [
      { value: "all", label: t("status.allStatuses") },
      { value: "active", label: t("status.active") },
      { value: "inactive", label: t("status.inactive") },
    ],
  };

  const tableHeaders = [
  { label: t("table.schemaName"), className: "w-[280px]" },
  { label: t("table.description"), className: "w-[320px]" },
  { label: t("table.fields"), className: "w-[120px]" },
  { label: t("table.status"), className: "w-[120px]" },
  { label: t("table.lastUpdated"), className: "w-[140px]" },
  { label: t("table.actions"), className: "w-[80px] text-right" },
];

  return (
    <div className="p-6 pt-0 max-w-10xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <Button
          className="font-medium gap-2"
          onClick={() => setopenCreateCategoryDrawer(true)}
        >
          <Plus className="h-4 w-4" />
          {t("createSchema")}
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter & Search Bar */}
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
                {filters.status.map((option) => (
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
                {tableHeaders.map((tableHeader) => (
                  <TableHead
                    key={tableHeader.label}
                    className={`h-10 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase ${tableHeader.className ||
                      ""}`}
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
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center py-4">
                      <FolderTree className="h-8 w-8 text-muted-foreground/50 mb-2 stroke-1" />
                      <p className="font-medium">{t("emptyState.title")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {searchTerm
                          ? t("emptyState.searchNoResults")
                          : t("emptyState.noData")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    {/* category Name & slug */}
                    <TableCell className="py-3 w-[280px]">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          href={`/categories/${category.id}`}
                          className="text-sm font-medium text-foreground hover:text-orange-600 transition-colors truncate"
                        >
                          {category.name}
                        </Link>
                        <span className="text-xs text-muted-foreground font-mono truncate">
                          {category.slug}
                        </span>
                      </div>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="py-3 w-[320px]">
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {category.description}
                      </span>
                    </TableCell>

                    {/* Fields Count */}
                    <TableCell className="py-3 w-[120px]">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>
                          {t("propertiesCount", {
                            count: category.schema.fields.length,
                          })}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3 w-[120px]">
                      <Badge
                        variant="outline"
                        className={`capitalize text-xs font-medium ${getStatusBadgeStyle(
                          category.is_active,
                        )}`}
                      >
                        {getStatusLabel(category.is_active)}
                      </Badge>
                    </TableCell>

                    {/* Last Updated Date */}
                    <TableCell className="py-3 w-[140px]">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>{formatDate(category.updated_at)}</span>
                      </div>
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="py-3 w-[80px] text-right">
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
                            <Link href={`/categories/${category.id}`}>
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{t("actions.edit")}</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{t("actions.delete")}</span>
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

      {/* Create Category Drawer */}
      <CreateCategoryDrawer
        isOpen={openCreateCategoryDrawer}
        onOpenChange={setopenCreateCategoryDrawer}
        onSubmitApi={handleCreateCategory}
      />
    </div>
  );
}