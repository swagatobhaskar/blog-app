'use client'

import { useState, useEffect } from "react"
import { getCurrentUser, logoutUser } from '@/lib/api/apiUserAuth'
import HandleAction from "@/lib/handleAction"
import User from "@/lib/types/user"
import Link from "next/link"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export default function AuthButtonsInHeader({user}: {user: User | null | undefined}) {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    // const [ user, setUser ] = useState< User | null >(null)
    // console.log("AuthHeader: ", token)
    if (user) {
        console.log("User in AuthHeader: ", user)
    } else {
        console.log("NO USER!")
    }

    const handleLogout = async () => {
        const { success, error } = await HandleAction(
            () => logoutUser(),
            {
                setLoading: setLoading,
                successMessage: 'Logout Successful',
                errorMessage: 'Logout Failed!'
            }
        )
        if ( success ) {
            // setUser(null)
            router.refresh()
        }
        if (error) {
            console.error("Error logging out!")
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center gap-4">
                <span>Loading...</span>
                {/* You can replace this with a spinner or other loading indicators */}
            </div>
        )
    }
    
    if (user) {
        console.log("User in <AuthButtonsInHeader />", user)
        return (
            <div className="flex items-center gap-4">
                <span>Hello</span>
                <Link href="/">
                    <Button variant="secondary">Home</Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost">
                    { loading ? '...' : 'Logout'} 
                </Button>
            </div>
        )
    }

    return (
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
    )
}
