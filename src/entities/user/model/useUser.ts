import { atom, useAtom } from "jotai"
import { User } from "./types"
import { fetchUserById as apiFetchUserById } from "../api"

const selectedUserAtom = atom<User | null>(null)

export const useUser = () => {
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom)

  const fetchUserById = async (userId: number) => {
    try {
      const userData = await apiFetchUserById(userId)
      setSelectedUser(userData)
      return userData
    } catch (error) {
      console.error("Error fetching user by ID:", error)
      throw error
    }
  }

  const clearSelectedUser = () => {
    setSelectedUser(null)
  }

  return {
    selectedUser,
    fetchUserById,
    clearSelectedUser,
  }
}
