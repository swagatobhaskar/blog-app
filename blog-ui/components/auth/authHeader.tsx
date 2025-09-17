'use client'

import { useState, useEffect } from "react"
import { getCurrentUser, logoutUser } from '@/lib/api/apiUserAuth'
import HandleAction from "@/lib/handleAction"
import User from "@/lib/types/user"
import Link from "next/link"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

type HeaderProps = {
  token?: string;
};

export default function AuthHeader({token}: HeaderProps) {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ user, setUser ] = useState< User | null >(null)
    // console.log("AuthHeader: ", token)
    if (token) {
        console.log("AuthHeader: ", token)
    } else {
        console.log("NO TOKEN")
    }
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         console.log("USE EFFECT....")
    //         const { data, success, error } = await HandleAction(
    //             () => getCurrentUser(),
    //             {
    //                 setLoading: setLoading,
    //                 successMessage: 'user found',
    //                 errorMessage: 'Failed to load User'
    //             }
    //         )
    //         if ( success && data ) {
    //             setUser(data)
    //         }
    //         if (error) {
    //             setUser(null)
    //             console.error("Error fetching currentuser data")
    //         }
    //         setLoading(false)
    //     }
    //     fetchUser()
    // }, [])

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
            setUser(null)
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
    
    if (token) {
        console.log("User ", user)
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
