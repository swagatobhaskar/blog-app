'use client'

import { useState } from 'react'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { email, z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const loginSchema = z.object({
    email: z.email(), //string().email(),
    password: z.string().min(8),
})

export default function LoginForm() {
    const [ loading, setLoading ] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
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

            <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
            </Button>
        </form>
    )
}
