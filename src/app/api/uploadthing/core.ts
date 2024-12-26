/* eslint-disable @typescript-eslint/no-unused-vars */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { prisma } from "@/lib/prisma";
import { checkUserIsInDb } from "@/server/chickuserIsibndb";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  mediaUploader: f({
    image: { maxFileSize: "1GB" },
    video: { maxFileSize: "16GB" },
    audio: { maxFileSize: "512MB" },
    text: { maxFileSize: "128MB" },
    pdf: { maxFileSize: "128MB" },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user || !user.id) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File url:", file.url);

      try {
        const user = await checkUserIsInDb(metadata.userId);
        if (!user) {
          throw new UploadThingError("User not found");
        }

        const fileUpload = await prisma.fileUpload.create({
          data: {
            name: file.name,
            key: file.key,
            url: file.url,
            size: file.size,
            type: file.type,
            userId: user.userId as string,
          },
          include: {
            user: true,
          },
        });
 
        console.log("File upload record created:", fileUpload.id);

        // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { 
          uploadedBy: user,
          fileId: fileUpload.id
        };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw new UploadThingError("Failed to process upload");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;