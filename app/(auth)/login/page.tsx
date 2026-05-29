"use client"
import React from "react"
import { useAppDispatch } from "@/app/redux/hooks"
import { login } from "@/app/redux/slice/authSlice"
import { useLoginMutation } from "@/app/redux/api/authApi"

export default function LoginPage() {

    const dispatch = useAppDispatch()
    const [loginUser, { isLoading, isError }] = useLoginMutation()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const result = await loginUser({

            email: formData.get("email") as string,
            password: formData.get("password") as string
        }).unwrap()

        dispatch(login(result))
    }

    if(isLoading) return <span>Loading...</span>
    if(isError) return <span>{isError}</span>
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen gap-4 ">

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-100 border border-gray-300 rounded p-3">
                <h1 className='text-center'>Login Form</h1>
                <input type="text" placeholder="Enter Email Here" name="email" id="email" className="border placeholder:text-sm placeholder:ps-2 border-gray-300 focus:outline-none rounded-md w-44" />
                <input type="text" placeholder="Enter Password Here" name="password" id="password" className="border placeholder:text-sm placeholder:ps-2 border-gray-300 focus:outline-none rounded-md w-44" />
                    <div className="flex justify-center">

                <button className='bg-blue-500 text-white px-2 py-1 rounded-lg'>Login</button>
                    </div>
            </form>
            </div>
        </>
    )
}