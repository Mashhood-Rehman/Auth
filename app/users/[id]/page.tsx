"use client"
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/app/redux/api/adminApi"
import { use, useEffect, useState } from "react"

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [formData, setFormData] = useState({ name: "", image: "" as string | null, email: "", password: "" })
    const [imagePreview, setImagePreview] = useState<string>("")
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const { data: user, isLoading } = useGetUserByIdQuery(id)
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                image: user.image,
                password: user.password,
            })
        }
    }, [user])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadError(null)
        setImagePreview(URL.createObjectURL(file))
        setIsUploadingImage(true)

        try {
            const data = new FormData()
            data.append("file", file)
            const res = await fetch("/api/upload", { method: "POST", body: data })
            const json = await res.json()

            if (!res.ok || !json.url) {
                throw new Error(json.error ?? "Failed to upload image")
            }

            const imageUrl = json.url as string
            let nextFormData = { ...formData, image: imageUrl }
            setFormData((prev) => {
                nextFormData = { ...prev, image: imageUrl }
                return nextFormData
            })

            // Persist image URL immediately so it is not lost if the user submits early
            await updateUser({ id, data: nextFormData }).unwrap()
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : "Failed to upload image")
        } finally {
            setIsUploadingImage(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isUploadingImage) return

        try {
            await updateUser({ id, data: formData }).unwrap()
        } catch (error) {
            console.error("Failed to update user:", error)
        }
    }

    if (isLoading) return <span>Loading...</span>

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    return (
        <div>
            <form onSubmit={handleUpdate}>
                <label>Name:</label>
                <input id="name" type="text" name="name" onChange={handleInputChange} value={formData?.name} />
                <label>Password:</label>
                <input id="password" type="text" name="password" onChange={handleInputChange} value={formData?.password} />
                <label>Email:</label>
                <input id="email" type="email" name="email" onChange={handleInputChange} value={formData?.email} />
                <label>Image:</label>
                {imagePreview ? (
                    <img src={imagePreview} alt="Image Preview" width={100} height={100} />
                ) : (
                    <img src={user?.image || ""} alt="Current Image" width={100} height={100} />
                )}
                <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {isUploadingImage && <p>Uploading image...</p>}
                {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
                <button type="submit" disabled={isUpdating || isUploadingImage}>
                    {isUpdating ? "Updating..." : isUploadingImage ? "Waiting for upload..." : "Update"}
                </button>
            </form>
        </div>
    )
}