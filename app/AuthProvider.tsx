"use client"
import { useEffect, useState } from "react";
import { useMeQuery } from "./redux/api/authApi";
import { useAppDispatch } from "./redux/hooks";
import { login, logout } from "./redux/slice/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const dispatch = useAppDispatch()
    const { data, isLoading, isError } = useMeQuery({}, { skip: !mounted })

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (data?.user) {
            dispatch(login({
                isAuthenticated: true,
                name: data.user.name,
                email: data.user.email,
                image: data.user.image,
                token: null
            }));
        } else if (!isLoading || isError) {
            dispatch(logout());
        }
    }, [data, isLoading, isError, mounted, dispatch]);

    if (!mounted || isLoading) {
        return <div className="h-screen w-screen flex items-center justify-center">Loading Session...</div>;
    }
    return <>{children}</>;
}