'use client'

import { useState, useEffect } from "react"
import { getCurrentUser } from '@/lib/api/apiUserAuth'
import HandleAction from "@/lib/handleAction"
import User from "@/lib/types/user"
import Link from "next/link"
import { Button } from "../ui/button"

export default function AuthHeader() {
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ user, setUser ] = useState< User | null >(null)

    useEffect(() => {
        const fetchUser = async () => {
            console.log("USE EFFECT....")
            const { data, success, error } = await HandleAction(
                () => getCurrentUser(),
                {
                    setLoading: setLoading,
                    successMessage: 'user found',
                    errorMessage: 'Failed to load User'
                }
            )
            if ( success && data ) {
                setUser(data)
            }
            if (error) {
                setUser(null)
                console.error("Error fetching currentuser data")
            }
            setLoading(false)
        }
        fetchUser()
    }, [])

    const handleLogout = () => {
        setUser(null)
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
        console.log("User ", user)
        return (
            <div className="flex items-center gap-4">
                <span>Hello, {user.id}</span>
                <Link href="/">
                    <Button variant="secondary">Home</Button>
                </Link>
                <Button onClick={() => handleLogout} variant="ghost">
                    Logout
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
