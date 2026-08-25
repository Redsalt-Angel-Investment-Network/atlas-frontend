"use client";

import { useState } from "react";
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
import { EditRoleModal } from "./components/EditRoleModal";
import { Role } from "@/_types/members";

// Mock Data
const MOCK_MEMBERS = [
  {
    id: "1",
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    role: "admin" as Role,
    status: "active",
    dateJoined: "2024-01-15",
  },
  {
    id: "2",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-02-01",
  },
  {
    id: "3",
    name: "Michael Scott",
    email: "m.scott@example.com",
    avatar: "",
    role: "member" as Role,
    status: "inactive",
    dateJoined: "2023-11-20",
  },
  {
    id: "4",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    role: "admin" as Role,
    status: "active",
    dateJoined: "2024-03-10",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@example.com",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-03-18",
  },
  {
    id: "6",
    name: "Amara Patel",
    email: "amara.p@example.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-04-02",
  },
  {
    id: "7",
    name: "Lucas Vance",
    email: "lucas.v@example.com",
    avatar: "",
    role: "member" as Role,
    status: "inactive",
    dateJoined: "2023-12-05",
  },
  {
    id: "8",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    role: "admin" as Role,
    status: "active",
    dateJoined: "2023-09-14",
  },
  {
    id: "9",
    name: "James Wilson",
    email: "j.wilson@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-04-15",
  },
  {
    id: "10",
    name: "Olivia Chen",
    email: "olivia.c@example.com",
    avatar: "",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-05-01",
  },
  {
    id: "11",
    name: "Marcus Brody",
    email: "marcus.b@example.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    role: "admin" as Role,
    status: "inactive",
    dateJoined: "2023-08-22",
  },
  {
    id: "12",
    name: "Emma Watson",
    email: "emma.w@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-05-12",
  },
  {
    id: "13",
    name: "Liam O'Connor",
    email: "liam.oc@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-06-03",
  },
  {
    id: "14",
    name: "Nina Gomez",
    email: "nina.g@example.com",
    avatar: "",
    role: "member" as Role,
    status: "inactive",
    dateJoined: "2024-01-28",
  },
  {
    id: "15",
    name: "Benjamin Hayes",
    email: "ben.hayes@example.com",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    role: "admin" as Role,
    status: "active",
    dateJoined: "2023-10-11",
  },
  {
    id: "16",
    name: "Chloe Dubois",
    email: "chloe.d@example.com",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-06-19",
  },
  {
    id: "17",
    name: "Tariq Al-Mansoor",
    email: "tariq.a@example.com",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-07-02",
  },
  {
    id: "18",
    name: "Isabella Silva",
    email: "isabella.s@example.com",
    avatar: "",
    role: "member" as Role,
    status: "inactive",
    dateJoined: "2024-02-14",
  },
  {
    id: "19",
    name: "Daniel Park",
    email: "daniel.park@example.com",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    role: "member" as Role,
    status: "active",
    dateJoined: "2024-07-20",
  },
  {
    id: "20",
    name: "Hannah Schmidt",
    email: "hannah.s@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    role: "admin" as Role,
    status: "active",
    dateJoined: "2023-07-30",
  },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<
    typeof MOCK_MEMBERS[0] | null
  >(null);

  const handleOpenEditModal = (member: typeof MOCK_MEMBERS[0]) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleSaveRole = (memberId: string, newRole: string) => {
    console.log(`Updated member ${memberId} role to ${newRole}`);
  };

  // Interactive filtering for demo purposes
  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      member.name.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search);

    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

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
              {filteredMembers.length === 0 ? (
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
                          <AvatarImage src={member.avatar} alt={member.name} />
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
                          member.status === "active"
                            ? "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "border-destructive/30 text-destructive bg-destructive/10"
                        }`}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>

                    {/* Date Joined */}
                    <TableCell className="py-3">
                      <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                        {member.dateJoined}
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
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleOpenEditModal(member)}>
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
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
      </div>
    </div>
  );
}