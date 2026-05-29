import prisma from "@/app/lib/prims"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users)
    } catch (error) {
        console.log("Error fetching users:", error)
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })

    }
}