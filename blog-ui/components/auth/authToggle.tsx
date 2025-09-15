// 'use client'

// import { useState } from 'react'
import { Button } from "../ui/button";

type AuthToggleProps = {
    mode: 'login' | 'signup';
    setMode: (mode: 'login' | 'signup') => void
}

export default async function AuthToggle({ mode, setMode }: AuthToggleProps) {

    // const [ mode, setMode ] = useState< 'login' | 'signup' | '' >()

    return (
        <div className="text-sm text-center mt-4">
            {mode === 'login' ? (
                <>
                    Don't have an account?{' '}
                    <Button onClick={() => setMode('signup')}
                        className="text-blue-600 hover:underline"
                    >
                        Sign Up
                    </Button>
                </>
            ) : (
                <>
                    Already have an account?{' '}
                    <Button onClick={() => setMode('login')}
                        className="text-blue-600 hover:underline"
                    >
                        Log In
                    </Button>
                </>
            )}
        </div>
    )
}
