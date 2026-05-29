import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { generateToken } from "@/app/lib/generateToken";
import prisma from "@/app/lib/prims";
import bcrypt from "bcryptjs"
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {

        const { name, email, password, image } = await req.json()

        const checkUser = await prisma.user.findUnique({
            where: { email }
        })

        if (checkUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                image
            }
        })
        const token = generateToken(email)
        const cookiesStore = await cookies()
        cookiesStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/"
        })
        const { password: _, ...safeUser } = user

        return NextResponse.json({ message: "User created successfully", token, user: safeUser }, { status: 201 })
    } catch (error) {
        console.log("Error creating user:", error)
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }
}