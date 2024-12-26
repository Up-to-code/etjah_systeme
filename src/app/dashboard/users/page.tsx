// app/users/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserManagement } from "@/components/pages/UserManagement";
 
export default async function UsersPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
 if (!userData) {
    return new Response("User not found", { status: 404 });
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagement currentUserRole={userData?.role} />
    </div>
  );
}