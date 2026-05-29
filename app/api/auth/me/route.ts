import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import prisma from "@/app/lib/prims";
export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return NextResponse.json({ error: "Unauthorized Access", user: null })
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { email: string }
        const user = await prisma.user.findUnique({
            where: { email: decoded.email }
        })
        if(!user) return NextResponse.json({error: "User not found", user:null})
            const {password:_, ...safeUser} = user
        return NextResponse.json({ user: safeUser })
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized Access", user: null })
    }
}