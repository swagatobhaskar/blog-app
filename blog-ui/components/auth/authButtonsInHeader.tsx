'use client'

import { useState } from "react"
import { logoutUser } from '@/lib/api/apiUserAuth'
import User from "@/lib/types/user"
import Link from "next/link"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export default function AuthButtonsInHeader({user}: {user: User | null | undefined}) {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    
    // if (user) {
    //     console.log("User in AuthButonsHeader: ", user)
    // } else {
    //     console.log("NO USER!")
    // }

    const handleLogout = async () => {
        setLoading(true);
        try{
            await logoutUser();  // nothing to return
            console.log("LOGOUT Successful!");
            // router.push('/');
            router.refresh(); // Force layout re-evaluation
        } catch (err) {
            console.error("Something went wrong: ", err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center gap-4">
                <span>Logging Out...</span>
                {/* You can replace this with a spinner or other loading indicators */}
            </div>
        )
    }
    
    if (user) {
        // console.log("User in <AuthButtonsInHeader />", user)
        return (
            <div className="flex items-center gap-4">
                <Button onClick={handleLogout} variant="secondary">
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
