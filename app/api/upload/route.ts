import cloudinary from "@/app/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "users" }, (error, uploadResult) => {
                    if (error) reject(error);
                    else if (!uploadResult) reject(new Error("Upload returned no result"));
                    else resolve(uploadResult);
                })
                .end(buffer);
        });

        const url = result.secure_url ?? result.url;
        if (!url) {
            return NextResponse.json({ error: "Upload succeeded but no URL was returned" }, { status: 500 });
        }

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}