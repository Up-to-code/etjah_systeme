import { prisma } from "@/lib/prisma";
import { UserManagement } from "@/components/pages/UserManagement";

export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: '#ffffff',
};

async function fetchUsers() {
  const users = await prisma.user.findMany();
  return users || [];
}

export default async function UsersPage() {
  const users = await fetchUsers();

  if (!users.length) {
    throw new Error("No users found.");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagement currentUserRole={users[0]?.role} />
    </div>
  );
}
