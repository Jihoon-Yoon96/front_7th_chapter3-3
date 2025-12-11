import { User } from "../model/types"
import { callAPI } from "../../../shared/lib/callAPI"

export const fetchUserById = async (id: number): Promise<User> => {
  const data = await callAPI<User>(`/users/${id}`)
  return data
}
