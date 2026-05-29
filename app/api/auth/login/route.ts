import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prims"
import { generateToken } from "@/app/lib/generateToken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    const checkUserExists = await prisma.user.findUnique({
        where: { email: email }
    })
    if (!checkUserExists) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    const isPasswordValid = await bcrypt.compare(password, checkUserExists.password)
    if (!isPasswordValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    const token = generateToken(email)
    const cookieStore = await cookies()
    cookieStore.set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
    })
    const { password: _, ...safeUser } = checkUserExists

    return NextResponse.json({ user: safeUser })
}