'use client'

import { useState } from 'react'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { email, z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export default function SignupForm() {
    const [ loading, setLoading ] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <Input placeholder='Email' {...register('email')} />
            {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}

            <Input type='password' placeholder='Password' {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

            <Input type='password' placeholder='Confirm Password' {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}

            <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
        </form>
    )
}
