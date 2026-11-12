"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/_core/utils/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { handleDeleteUser, handleUpdateUserStatus } from "../_core/admin.actions";
import { IUser } from "../_core/admin.interface";
import { actionBtn, ActionResult, CONFIRM_TIMEOUT_MS, headCell } from "./constants";

function StatusBadge({ status }: { status: string }) {
  const active = status === "ACTIVE";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        active
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300",
      )}
    >
      <span className={cn("size-1.5 rounded-full", active ? "bg-emerald-400" : "bg-red-400")} />
      {status}
    </Badge>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md font-mono text-[11px] uppercase tracking-wider",
        role === "ADMIN"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-white/10 bg-white/5 text-gray-300",
      )}
    >
      {role}
    </Badge>
  );
}

export function UserManagementTable({ users }: { users: IUser[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const run = async (userId: string, action: () => Promise<ActionResult>) => {
    setPendingId(userId);
    try {
      const res = await action();
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPendingId(null);
      setConfirmId(null);
    }
  };

  const toggleStatus = (user: IUser) => {
    const status = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    return run(user.id, () => handleUpdateUserStatus(user.id, { status }));
  };

  const askDelete = (userId: string) => {
    setConfirmId(userId);
    setTimeout(() => setConfirmId((current) => (current === userId ? null : current)), CONFIRM_TIMEOUT_MS);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/3 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_30px_-12px_rgba(0,0,0,0.6)]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 bg-white/3 hover:bg-white/3">
            <TableHead className={headCell}>User</TableHead>
            <TableHead className={headCell}>Role</TableHead>
            <TableHead className={headCell}>Status</TableHead>
            <TableHead className={cn(headCell, "text-right")}>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="h-28 text-center text-sm text-gray-500">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const pending = pendingId === user.id;
              const confirming = confirmId === user.id;
              const active = user.status === "ACTIVE";

              return (
                <TableRow key={user.id} className="border-white/5 transition-colors hover:bg-emerald-500/4">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-linear-to-br from-emerald-500/20 to-emerald-500/5 text-sm font-semibold text-emerald-300 ring-2 ring-emerald-500/5">
                        {user.name?.charAt(0).toUpperCase() ?? "?"}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{user.name}</p>
                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        disabled={pending}
                        onClick={() => toggleStatus(user)}
                        className={cn(
                          actionBtn,
                          active
                            ? "border-white/10 bg-white/5 text-gray-200 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-200"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200",
                        )}
                      >
                        {pending ? <Loader2 className="animate-spin" /> : active ? <ShieldOff /> : <ShieldCheck />}
                        {active ? "Block" : "Activate"}
                      </Button>

                      <Button
                        variant="outline"
                        disabled={pending}
                        onClick={() => (confirming ? run(user.id, () => handleDeleteUser(user.id)) : askDelete(user.id))}
                        className={cn(
                          actionBtn,
                          confirming
                            ? "border-red-500/60 bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-red-100"
                            : "border-white/10 bg-white/5 text-gray-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300",
                        )}
                      >
                        <Trash2 />
                        {confirming ? "Confirm?" : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}