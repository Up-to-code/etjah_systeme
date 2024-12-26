/* eslint-disable @typescript-eslint/no-unused-vars */
// components/UserManagement.tsx
"use client";

import { useEffect, useState } from "react";
 import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Define the Role type based on your enum
type Role = 'User' | 'editor' | 'call_center' | 'Admin';

const ROLES: Role[] = ['User', 'editor', 'call_center', 'Admin'];

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function UserManagement({ currentUserRole }: { currentUserRole: Role }) {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);
  const isAdmin = currentUserRole === 'Admin';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch users",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [toast]);

  const updateRole = async (id: string, newRole: Role) => {
    if (!isAdmin) return;

    setIsUpdatingRole(id);
    try {
      const response = await fetch('/api/users/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id, role: newRole }),
      });
      
      if (response.ok) {
        setUsers(users.map((user) => 
          user.id === id ? { ...user, role: newRole } : user
        ));
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
      } else {
        const errorData = await response.text();
        toast({
          title: "Error",
          description: errorData,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingRole(null);
    }
  };

  // Format role for display
  const formatRole = (role: Role) => {
    switch (role) {
      case 'call_center':
        return 'Call Center';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {isAdmin ? (
                  <Select
                    value={user.role}
                    onValueChange={(value) => updateRole(user.id, value as Role)}
                    disabled={isUpdatingRole === user.id}
                  >
                    <SelectTrigger className="w-[180px]">
                      {isUpdatingRole === user.id ? (
                        <div className="flex items-center gap-2">
                          <span className="animate-spin">⌛</span>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <SelectValue>{formatRole(user.role)}</SelectValue>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {formatRole(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span>{formatRole(user.role)}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}