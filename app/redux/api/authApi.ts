import { apiSlice } from "../slice/apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials
            }),
        }),
        signup: builder.mutation({
            query: (credentials) => ({
                url: "/auth/signup",
                method: "POST",
                body: credentials
            }),
        }),
        me: builder.query({
            query: () => ({
                url: "/auth/me",
                method: "GET"
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        })
    })
})

export const { useLoginMutation, useSignupMutation, useMeQuery, useLogoutMutation } = authApi