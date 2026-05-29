import prisma from "@/app/lib/prims";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params
        const getUser = await prisma.user.findFirst({
            where: {id: id}
        })
        if(!getUser) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

         const body = await req.json()
         const { name, email, password, image } = body

         const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(password !== undefined && { password }),
                ...(image !== undefined && { image }),
            },
         })
         
         return NextResponse.json({message: "user updated successfully",updatedUser})
    }catch(error) {
        return NextResponse.json({error: "Failed to update user"}, {status: 500})
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params
        
        const user = await prisma.user.findFirst({
            where: {id: id}
        })
        
        if(!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        return NextResponse.json(user)
    }catch(error) {
        return NextResponse.json({error: "Failed to fetch user"}, {status: 500})
    }
}