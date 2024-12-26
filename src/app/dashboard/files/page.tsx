/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useEffect, useState } from "react";
import {
  File,
  Image,
  Video,
  Music,
  FileText,
  Download,
  Trash2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface FileData {
  id: string;
  name: string;
  key: string;
  type: string;
  userId: string;
  createdAt: string;
  url: string;
  size: number;
}

interface ApiResponse {
  data: FileData[];
  totalPages: number;
}

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download file");
  }
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) {
    return <Image className="h-8 w-8 text-blue-500 fill-current" />;
  } else if (type.startsWith("video/")) {
    return <Video className="h-8 w-8 text-red-500" />;
  } else if (type.startsWith("audio/")) {
    return <Music className="h-8 w-8 text-green-500" />;
  } else if (
    type.includes("pdf") ||
    type.includes("document") ||
    type.includes("sheet")
  ) {
    return <FileText className="h-8 w-8 text-yellow-500" />;
  }
  return <File className="h-8 w-8 text-gray-500" />;
};

const FileCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
    <div className="flex items-center mb-4">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-4 w-48 ml-3" />
    </div>
    <Skeleton className="h-4 w-24 mb-2" />
    <div className="flex items-center mb-4">
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="h-4 w-32 ml-2" />
    </div>
    <Skeleton className="h-4 w-36 mb-4" />
    <div className="flex justify-between mt-auto">
      <Skeleton className="h-9 w-full mr-2" />
      <Skeleton className="h-9 w-9" />
    </div>
  </div>
);

export default function Files() {
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const fetchFiles = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/files?page=${page}&limit=5`);
      const data: ApiResponse = await response.json();
      setFileList(data.data);
      setTotalPages(Math.max(1, data.totalPages));
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/files/${id}`, { method: "DELETE" });
      setFileList(fileList.filter((file) => file.id !== id));
      if (fileList.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleDownload = async (
    url: string,
    fileName: string,
    fileId: string
  ) => {
    try {
      setDownloadingFile(fileId);
      await downloadFile(url, fileName);
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Files</h2>
      <div className="min-h-[calc(100vh-20rem)]">
        {!isLoading && fileList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <File className="h-16 w-16 mb-4" />
            <p className="text-lg">No files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => <FileCardSkeleton key={index} />)
              : fileList.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col"
                  >
                    <div className="flex items-center mb-4">
                      {getFileIcon(file.type)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-3 font-semibold truncate max-w-[200px]">
                              {file.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{file.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      Size: {formatFileSize(file.size)}
                    </div>
                    <div className="flex items-center mb-4">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm text-gray-600 truncate">
                        User
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Uploaded:{" "}
                      {format(new Date(file.createdAt), "MMM d, yyyy HH:mm")}
                    </div>
                    <div className="flex justify-between mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mr-2"
                        disabled={downloadingFile === file.id}
                        onClick={() =>
                          handleDownload(file.url, file.name, file.id)
                        }
                      >
                        {downloadingFile === file.id ? (
                          <span className="flex items-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Downloading...
                          </span>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>

      {!isLoading && fileList.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="outline"
            disabled={page === 1 || isLoading}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages || isLoading}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
