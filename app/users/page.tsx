"use client"
import Image from "next/image"
import { useDeleteUserMutation, useGetUsersQuery } from "../redux/api/adminApi"
import { useRouter } from "next/navigation"
import { useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";

interface Message {
  senderId: string;
  text: string;
  timestamp: string;
}

export default function Users() {
  const router = useRouter()
  const { data: users, isLoading, isError } = useGetUsersQuery({})
  const [deleteUser] = useDeleteUserMutation()
  const currentUser = useAppSelector((state) => state.auth)

  const [activeChatUser, setActiveChatUser] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser.isAuthenticated) return
    const socket = getSocket()

    // 1. Initiate connection
    socket.connect()

    // 2. ONLY register after connection is fully established
    socket.on("connect", () => {
      console.log("Socket connected! ID:", socket.id)
      socket.emit("register_user", currentUser.email)
    })

    // 3. Catch and log any connection errors (CORS, network, etc.)
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })

    socket.on("online_users_list", (usersList: string[]) => {
      console.log("Active online users received:", usersList)
      setOnlineUsers(usersList)
    })

    socket.on("receive_private_message", (message: Message) => {
      setChatMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("online_users_list");
      socket.off("receive_private_message");
      socket.disconnect();
    };
  }, [currentUser])
  const handleDeleteUser = async (email: string) => {
    try {
      await deleteUser(email).unwrap()
    }
    catch (error) {
      console.log("error on frnotend deleting user", error)
    }
  }

  if (isLoading) return <span>Loading...</span>
  if (isError) return <span>Something went wrong</span>

  const handleEditUser = (u: any) => {
    try {
      router.push(`/users/${u.id}`)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!messageInput.trim()) return
      const socket = getSocket()
      socket.emit("send_private_message", {
        senderId: currentUser.email,
        receiverId: activeChatUser.email,
        text: messageInput
      })
      setMessageInput("")
    } catch (error) {
      console.log("error in sending message", error)
    }
  }
  return (
    <>
      <div className="flex flex-col">
        <table className="table-fixed w-full border border-black">
          <thead>
            <tr>
              <th className="border border-black w-32">ID</th>
              <th className="border border-black">Image</th>
              <th className="border border-black">Name</th>
              <th className="border border-black">Email</th>
              <th className="border border-black">Status</th>
              <th className="border border-black">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users?.map((user: any) => {
              const isSelf = user.email === currentUser.email;
              const isOnline = onlineUsers.includes(user.email);
              return (

                <tr key={user.id}>
                  <td className="border border-black w-32">
                    <div className="truncate overflow-hidden whitespace-nowrap">
                      {user.id}
                    </div>
                  </td>

                  <td className="border border-black">
                    <Image
                      src={user.image || "/download.png"}
                      alt={user.name}
                      width={50}
                      height={50}
                    />
                  </td>

                  <td className="border border-black">
                    {user.name} {isSelf && <span className="text-gray-400 font-semibold">(You)</span>}
                  </td>

                  <td className="border border-black">
                    {user.email}
                  </td>
                  <td className="border border-black text-center px-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="ml-1 text-sm">{isOnline ? "Online" : "Offline"}</span>
                  </td>
                  <td className="border space-x-3 ml-auto border-black h-full">
                    <button onClick={() => handleEditUser(user)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDeleteUser(user.email)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    {!isSelf && (
                      <button
                        onClick={() => {
                          setActiveChatUser(user);
                          setChatMessages([]);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm transition-colors"
                      >
                        💬 Message
                      </button>)}
                  </td>
                </tr>
              )

            })}
          </tbody>
        </table>
      </div>
      {
        activeChatUser && (
          <div className="bg-white max-h-96 flex flex-col h-full  max-w-sm w-full rounded-lg border border-gray-300">
            {/* header div */}
            <div className="bg-gray-100 flex justify-between items-center border-b bordergray-500">
              <div className="ps-3 py-2">
                <h3>{activeChatUser?.name}</h3>
                <span>{activeChatUser?.email}</span>
              </div>
              <button
                onClick={() => setActiveChatUser(null)}
                className="text-red-500 pe-3 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
            {/* main body  */}
            <div className="flex-1 overflow-y-auto p-3 h-100">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">No messages yet. Say hello!</div>
              ) : (
                chatMessages.map((msg, index) => {
                  const isMe = msg.senderId === currentUser.email;
                  return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2 rounded-lg max-w-[75%] ${isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-[10px] block text-right mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            {/* footer  */}
            <div className="p-3 border-t  border-gray-300">
              <form onSubmit={handleSendMessage} className="flex justify-between"><input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} className="border border-gray-300 rounded-lg" />
                <button className="bg-blue-400 text-white rounded-full p-1">Send</button></form>
            </div>
          </div>
        )
      }
    </>

  )
}