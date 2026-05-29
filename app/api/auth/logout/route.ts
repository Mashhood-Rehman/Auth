import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
    const cookieStore = await cookies()
    const token = cookieStore.set("token", "", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(0),
        path: "/"
    })
    return NextResponse.json({ message: "Logged out successfully" })
}