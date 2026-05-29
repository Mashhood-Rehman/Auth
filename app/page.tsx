"use client"
import Image from "next/image"
import { useGetUsersQuery } from "./redux/api/adminApi"

export default function Home() {
  const { data: users, isLoading, isError } = useGetUsersQuery({})

  if (isLoading) return <span>Loading...</span>
  if (isError) return <span>Something went wrong</span>

  return (
    <table className="table-fixed w-full border border-black">
      <thead>
        <tr>
          <th className="border border-black w-32">ID</th>
          <th className="border border-black">Image</th>
          <th className="border border-black">Name</th>
          <th className="border border-black">Email</th>
          <th className="border border-black">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users?.map((user: any) => (
          <tr key={user.id}>
            <td className="border border-black w-32">
              <div className="truncate overflow-hidden whitespace-nowrap">
                {user.id}
              </div>
            </td>

            <td className="border border-black">
              <Image
                src={user.image || ""}
                alt={user.name}
                width={50}
                height={50}
              />
            </td>

            <td className="border border-black">
              {user.name}
            </td>

            <td className="border border-black">
              {user.email}
            </td>
            <td className="border space-x-3 ml-auto border-black h-full">
              <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}