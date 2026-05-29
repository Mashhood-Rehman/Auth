import { apiSlice } from "../slice/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
                url: "/users",
                method: "GET",
            }),
            providesTags: ["User"]
         }),
         updateUser: builder.mutation({
            query: ({id, data}) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["User"]
         }),
         getUserById: builder.query({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: "User", id }]
         }),
         updateUserImage: builder.mutation({
            query: (formData) => ({
                url: "/upload",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["User"]
         }),
         deleteUser: builder.mutation({
            query: (email) => ({
                url: "/users/delete",
                method:"DELETE",
                body: { email }
            }),
            invalidatesTags: ["User"]
         })
    })
})

export const { useUpdateUserImageMutation, useGetUsersQuery, useUpdateUserMutation, useGetUserByIdQuery, useDeleteUserMutation } = adminApi