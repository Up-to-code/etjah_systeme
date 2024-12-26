/* eslint-disable @typescript-eslint/no-unused-vars */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { prisma } from "@/lib/prisma";
import { checkUserIsInDb } from "@/server/chickuserIsibndb";

const f = createUploadthing();

// FileRouter for your app
export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "1GB" },
    video: { maxFileSize: "16GB" },
    audio: { maxFileSize: "512MB" },
    text: { maxFileSize: "128MB" },
    pdf: { maxFileSize: "128MB" },
  })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) {
        throw new UploadThingError("Unauthorized: User session is invalid.");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      try {
        // Ensure user exists in the database
        const user = await checkUserIsInDb(metadata.userId);
        if (!user) {
          throw new UploadThingError("User not found in the database.");
        }

        // Create a new file upload record in the database
        const fileUpload = await prisma.fileUpload.create({
          data: {
            name: file.name,
            key: file.key,
            url: file.url,
            size: file.size,
            type: file.type,
            userId: user.userId as string,
          },
        });

        console.log("File upload record created:", fileUpload.id);

        // Return a response compatible with JsonObject
        return {
          uploadedBy: {
            success: true,
            userId: user.userId,
          },
          fileId: fileUpload.id,
        } as const; // Ensure it's JsonObject-compatible
      } catch (error) {
        console.error("Error in onUploadComplete:", error);

        // Return a JSON-safe error structure
        return {
          uploadedBy: {
            success: false,
            userId: metadata.userId,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          fileId: null,
        } as const;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
