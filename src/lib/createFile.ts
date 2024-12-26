"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "./prisma";
import { checkUserIsInDb } from "@/server/chickuserIsibndb";

export async function createFile(file: {
  name: string;
  key: string;
  url: string;
  size: number;
  type: string;
}) {
  try {
    // This code runs on your server before upload
    const { getUser } = getKindeServerSession();
    const User = await getUser();
    const user = await checkUserIsInDb(User.id);
    if (!user.userId) {
      throw new Error("User not found");
    }

    await prisma.fileUpload.create({
      data: {
        name: file.name,
        key: file.key,
        url: file.url,
        size: file.size,
        type: file.type,
        userId: user.userId,
      },
      include: {
        user: true,
      },
    });
    return file;
  } catch (error) {
    console.error("Error in onUploadComplete:", error);
    throw new Error("Failed to process upload");
  }
}
