"use client";

import { createFile } from "@/lib/createFile";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-6">
      <UploadDropzone
        endpoint="mediaUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);

          res.map((file) => {
            createFile(file);
          });
          toast({
            variant: "default",
            title: "Success",
            description: "File uploaded successfully",
          });
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        }}
      />
    </main>
  );
}
