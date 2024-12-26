import ClintRoot from "@/components/layout/ClintRoot";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const CanAccess = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });
  if (CanAccess?.role.includes("User") || CanAccess?.role == null) {
    return redirect("/NotAccsess");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ClintRoot>{children}</ClintRoot>
    </div>
  );
}
