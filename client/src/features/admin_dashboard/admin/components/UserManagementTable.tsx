"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; 
import { useState } from "react";
import { IUser } from "../_core/admin.interface";
import { handleDeleteUser, handleUpdateUserStatus } from "../_core/admin.actions";

interface UserManagementTableProps {
  users: IUser[];
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setLoadingId(userId);

    const res = await handleUpdateUserStatus(userId, { status: newStatus });
    
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setLoadingId(null);
  };

  const onDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoadingId(userId);

    const res = await handleDeleteUser(userId);
    
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setLoadingId(null);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={loadingId === user.id}
                  onClick={() => handleStatusChange(user.id, user.status)}
                >
                  {user.status === "ACTIVE" ? "Block" : "Activate"}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={loadingId === user.id}
                  onClick={() => onDelete(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}