import { User } from "../model/types"

export const fetchUserById = async (userId: number): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`)
  const userData: User = await response.json()
  return userData
}
