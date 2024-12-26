"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function Edit_user_data(type_of_role: Role) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!isAuthenticated) {
    return new Response("You are not authenticated", { status: 401 });
  }

  try {
    const user = await getUser();
    try {
      const { id } = user;
      const UserData = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      const isAdmin = UserData?.role.includes("admin");
      if (!isAdmin) {
        return new Response("You are not authenticated", { status: 401 });
      }

      // Update the user's role
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          role: type_of_role,
        },
      });

      return new Response(
        JSON.stringify({
          message: "Role updated successfully",
          user: updatedUser,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      return new Response("Error updating user role", { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response("Error fetching user", { status: 500 });
  }
}
