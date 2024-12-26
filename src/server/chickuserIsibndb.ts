/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Define custom error types
type UserCheckError = {
  code: string;
  message: string;
  details?: unknown;
};

// Define user creation data type
type UserCreateData = {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  role: "User" | "Admin";
};

/**
 * Checks if a user exists in the database and creates a new user if not found.
 * @param uid - The user ID to check
 * @returns Object containing success status, user ID, and any error information
 */
const checkUserIsInDb = async (
  uid: string
): Promise<{
  success: boolean;
  userId: string | null;
  error?: UserCheckError;
}> => {
  try {
    if (!uid?.trim()) {
      return {
        success: false,
        userId: null,
        error: {
          code: "INVALID_INPUT",
          message: "User ID is required",
        },
      };
    }

    const { getUser } = getKindeServerSession();

    // Check existing user with timeout
    const user = await Promise.race([
      prisma.user.findUnique({
        where: { id: uid },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), 5000)
      ),
    ]);

    if (user) {
      return { success: true, userId: uid };
    }

    // Get Kinde user information
    const kindeUser = await getUser();
    if (!kindeUser?.id) {
      return {
        success: false,
        userId: null,
        error: {
          code: "KINDE_USER_NOT_FOUND",
          message: "Failed to retrieve user information from Kinde",
        },
      };
    }

    // Prepare user data with validation
    const userData: UserCreateData = {
      id: kindeUser.id,
      email: kindeUser.email ?? "",
      name: kindeUser.given_name ?? "",
      imageUrl: kindeUser.picture ?? "",
      role: "User",
    };

    // Validate email format if provided
    if (userData.email && !validateEmail(userData.email)) {
      return {
        success: false,
        userId: null,
        error: {
          code: "INVALID_EMAIL",
          message: "Invalid email format",
        },
      };
    }

    // Create new user with transaction
    const newUser = await prisma.$transaction(async (tx) => {
      // Double-check user doesn't exist to prevent race conditions
      const existingUser = await tx.user.findUnique({
        where: { id: userData.id },
      });

      if (existingUser) {
        return existingUser;
      }

      return await tx.user.create({
        data: userData,
      });
    });

    console.log(
      `User ${newUser.id} successfully ${user ? "found" : "created"}`
    );

    return {
      success: true,
      userId: newUser.id,
    };
  } catch (error) {
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return handlePrismaError(error);
    }

    // Handle timeout errors
    if (error instanceof Error && error.message === "Database timeout") {
      return {
        success: false,
        userId: null,
        error: {
          code: "DATABASE_TIMEOUT",
          message: "Database operation timed out",
        },
      };
    }

    // Log unexpected errors
    console.error("Unexpected error in checkUserIsInDb:", error);
    return {
      success: false,
      userId: null,
      error: {
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
        details: error,
      },
    };
  }
};

/**
 * Validates email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Handles specific Prisma errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case "P2002":
      return {
        success: false,
        userId: null,
        error: {
          code: "UNIQUE_CONSTRAINT",
          message: "User with this ID already exists",
          details: error,
        },
      };
    case "P2003":
      return {
        success: false,
        userId: null,
        error: {
          code: "FOREIGN_KEY_CONSTRAINT",
          message: "Invalid reference to related data",
          details: error,
        },
      };
    default:
      return {
        success: false,
        userId: null,
        error: {
          code: "PRISMA_ERROR",
          message: "Database operation failed",
          details: error,
        },
      };
  }
}

export { checkUserIsInDb };
