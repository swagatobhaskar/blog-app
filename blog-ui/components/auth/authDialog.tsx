'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from "../ui/button"
import AuthToggle from './authToggle'
import LoginForm from './loginForm'
import SignupForm from './signupForm'

export default function AuthDialog() {
    const [ mode, setMode ] = useState< 'login' | 'signup' >('login')

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="btn">Login / Signup</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === 'login' ? 'Log In' : 'Sign Up'}</DialogTitle>
                </DialogHeader>
                {mode  === 'login' ? <LoginForm /> : <SignupForm />}
                <AuthToggle mode={mode} setMode={setMode} />
            </DialogContent>
        </Dialog>
    )
}