// types/user.ts
export interface UserListItem {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  role: string
  status: string
  is_active: boolean
  created_at: string
}