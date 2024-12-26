import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
    try {
        const { getUser, isAuthenticated } = getKindeServerSession();
        const authenticated = await isAuthenticated();
        
        if (!authenticated) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const kindeUser = await getUser();
        if (!kindeUser?.id || !kindeUser?.email) {
            return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
        }

        // Get or create user in database
        const user = await prisma.user.upsert({
            where: { email: kindeUser.email },
            update: {
                name: kindeUser.given_name || kindeUser.family_name,
                imageUrl: kindeUser.picture
            },
            create: {
                id: kindeUser.id,
                email: kindeUser.email,
                name: kindeUser.given_name || kindeUser.family_name,
                imageUrl: kindeUser.picture,
                role: Role.User // Default role for new users
            },
            select: {
                id: true,
                email: true,
                name: true,
                imageUrl: true,
                role: true
            }
        });

        return NextResponse.json({
            user,
            authenticated,
            status: "success"
        });

    } catch (error) {
        console.error("Session error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export type KindeSessionResponse = {
    user?: {
        id: string;
        email: string;
        name?: string;
        imageUrl?: string;
        role: Role;
    };
    authenticated?: boolean;
    status?: string;
    error?: string;
};

