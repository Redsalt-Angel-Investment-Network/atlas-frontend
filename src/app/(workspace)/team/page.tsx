"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  UserCog,
  User,
  Pencil,
  Trash2,
  MoreHorizontal,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceMemberType } from "@/_types/workspaceMembers";
import { getWorkspaceMembers } from "@/app/(workspace)/index";
import { useAuth } from "@/app/_contexts/AuthContext";
import { EditRoleModal } from "./components/EditRoleModal";
import { MemberType, Role } from "@/_types/members";
import { DeactivateMemberModal } from "./components/DeactivateMemberModal";

const tableHeaders = [
  { label: "Member", className: "w-[300px]" },
  { label: "Role" },
  { label: "Status" },
  { label: "Joined" },
  { label: "Actions", className: "text-right" },
];

const filters = {
  role: [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "member", label: "Member" },
  ],
  status: [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
};

export default function MembersPage() {
  const { currentMembership } = useAuth();
  const workspaceId = currentMembership?.workspace_id;
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [members, setMembers] = useState<WorkspaceMemberType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<WorkspaceMemberType | null>(null);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  const handleOpenEditModal = (member: WorkspaceMemberType) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleSaveRole = (memberId: string, newRole: string) => {
    console.log(`Updated member ${memberId} role to ${newRole}`);
  };

  const fetchMembers = async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    getWorkspaceMembers(workspaceId)
      .then(setMembers)
      .catch((err) => setError(err.message ?? "Failed to load members"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const handleOpenDeactivateModal = (member: WorkspaceMemberType ) => {
    setSelectedMember(member);
    setDeactivateModalOpen(true);
  };

  const handleDeactivateMember = (memberId: string) => {
    console.log(`Deactivated member ${memberId}`);
  };

  // Interactive filtering
  const filteredMembers = members.filter((member) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search || 
      member.name.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? !member.is_deleted : member.is_deleted);

    const matchesRole = roleFilter === "all" || member.role === roleFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 pt-0 max-w-10xl mx-auto space-y-6 ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Workspace Members
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members, roles, and access permissions.
          </p>
        </div>
        <Button className="font-medium gap-2">
          <Plus className="h-4 w-4" />
          Invite Member
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm shadow-none focus-visible:ring-1"
            />
          </div>

          {/* Role Select */}
          <div className="w-full sm:w-36">
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full h-9 text-sm shadow-none focus:ring-1">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {filters.role.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    className={`h-10 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase ${tableHeader.className}`}
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
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    Loading members....
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-sm text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No members found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    {/* Avatar + Name + Email */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border/40 shrink-0">
                          <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground truncate leading-snug">
                            {member.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate leading-snug">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role Badge */}
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={`gap-1.5 px-2.5 py-0.5 text-xs font-medium capitalize border ${
                          member.role === "admin"
                            ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300"
                            : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                        }`}
                      >
                        {member.role === "admin" ? (
                          <UserCog className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <User className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        {member.role}
                      </Badge>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={`capitalize text-xs font-medium ${
                          !member.is_deleted
                            ? "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "border-destructive/30 text-destructive bg-destructive/10"
                        }`}
                      >
                        {member.is_deleted ? "inactive" : "active"}
                      </Badge>
                    </TableCell>

                    {/* Date Joined */}
                    <TableCell className="py-3">
                      <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                        {new Date(member.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => handleOpenEditModal(member)}
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDeactivateModal(member) } className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                            Deactivate
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

        {/* Edit Role Modal Component */}
        <EditRoleModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          member={selectedMember}
          onSave={handleSaveRole}
        />

        {/* Deactivate Member Modal Component */}
        <DeactivateMemberModal
          open={deactivateModalOpen}
          onOpenChange={setDeactivateModalOpen}
          member={selectedMember}
          onDeactivate={handleDeactivateMember}
        />
      </div>
    </div>
  );
}