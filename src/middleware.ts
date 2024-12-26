/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(async function middleware(req: NextRequest) {
  
});

export const config = {
  matcher: ["/dashboard:path*"],
};
