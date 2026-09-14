"use client";

import { useState, useEffect } from "react";
import { User, UserCog } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberType, Role } from "@/_types/members";

interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberType | null;
  onSave?: (memberId: string, newRole: Role) => void;
}

export function EditRoleModal({
  open,
  onOpenChange,
  member,
  onSave,
}: EditRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState(member?.role ?? "member");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSave?.(member.id, selectedRole);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  };

  const roles = [
    {
      value: "admin",
      label: "Admin",
      description: "Full access to all settings and members.",
      icon: UserCog,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      value: "member",
      label: "Member",
      description: "Standard access to workspace.",
      icon: User,
      color: "text-slate-500",
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member Role</DialogTitle>
          <DialogDescription>
            Change access level and permissions for this workspace member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Member Card Preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                {member.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-foreground">
                {member.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {member.email}
              </span>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role-select">Select Role</Label>
            <Select
              defaultValue={member.role || "member"}
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as Role)}
            >
              <SelectTrigger id="role-select" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(
                  ({ value, label, description, icon: Icon, color }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                        <div className="flex flex-col text-left">
                          <span className="font-medium leading-none">
                            {label}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
