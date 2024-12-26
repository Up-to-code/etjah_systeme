// app/api/users/route.ts
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { isAuthenticated } = getKindeServerSession();

  if (!isAuthenticated) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// app/api/users/role/route.ts
export async function PUT(req: Request) {
  const { getUser, isAuthenticated } = getKindeServerSession();

  if (!isAuthenticated) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const currentUser = await getUser();
    const userData = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (userData?.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, role } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
