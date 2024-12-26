"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function Edit_user_data(type_of_role: Role) {
  const { getUser, isAuthenticated } = getKindeServerSession();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return new Response(
      JSON.stringify({ error: true, message: "You are not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Get user data
    const user = await getUser();
    const { id } = user;

    // Fetch user data from the database
    const UserData = await prisma.user.findUnique({ where: { id } });

    // Handle the case where user does not exist in the database
    if (!UserData) {
      return new Response(
        JSON.stringify({ error: true, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the authenticated user is an admin (use Role enum for comparison)
    const isAdmin = UserData.role === Role.Admin;  // Assuming 'admin' is part of the Role enum
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: true, message: "Unauthorized access" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate the new role
    if (!Object.values(Role).includes(type_of_role)) {
      return new Response(
        JSON.stringify({ error: true, message: "Invalid role type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: type_of_role },
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Role updated successfully",
        user: updatedUser,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    // Cast the error to an instance of Error to access message and stack
    if (error instanceof Error) {
      // Log detailed error for debugging
      console.error("Error in Edit_user_data:", error.message, error.stack);

      // Return a generic error response to avoid exposing sensitive details
      return new Response(
        JSON.stringify({
          error: true,
          message: "An internal error occurred while processing the request",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // In case the error is not an instance of Error (shouldn't happen)
    console.error("Unknown error:", error);
    return new Response(
      JSON.stringify({
        error: true,
        message: "An unknown error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
