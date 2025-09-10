"use client"

import { LogOut } from "lucide-react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const router = useRouter()

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/") // redirect to login page
        },
      },
    })
  }

  return (
    <DropdownMenuItem
      onClick={signOut}
      className="flex items-center cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </DropdownMenuItem>
  )
}
