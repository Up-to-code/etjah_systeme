import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const GET = async function (req: NextRequest) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const files = await prisma.fileUpload.findMany({
    skip,
    take: limit,
  });

  const totalFiles = await prisma.fileUpload.count();

  return NextResponse.json({
    data: files,
    total: totalFiles,
    page,
    totalPages: Math.ceil(totalFiles / limit),
  });
};

export { GET };
