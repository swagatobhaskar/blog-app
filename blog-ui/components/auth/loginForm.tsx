'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { email, z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { loginUser } from '@/lib/api/apiUserAuth'
import HandleAction from '@/lib/handleAction'

const loginSchema = z.object({
    email: z.email(), //string().email(),
    password: z.string().min(8),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    // const [ loginError, setLoginError ] = useState<Error | unknown>()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (formData: LoginFormData) => {
        setLoading(true)
        const { data, success, error } = await HandleAction(
            () => loginUser(formData.email, formData.password),
            {
                setLoading: setLoading,
                successMessage: 'Login Successful.',
                errorMessage: 'Error loging in!'
            }
        )
        if (success && data) {
            setLoading(false)
            console.log("DATA:",data)
            router.push('/')
        }
        if (!success || error) {
            setLoading(false)
            console.error("Log in Error", error)
            // setLoginError(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <Input placeholder='Email' {...register('email')} />
            {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}

            <Input type='password' placeholder='Password' {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            {/* { loginError && <p>{error error.message}</p> } */}
            <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
            </Button>
        </form>
    )
}
