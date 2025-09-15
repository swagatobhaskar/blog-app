import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center px-4 bg-muted">    {/*min-h-screen */} 
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Optional: Brand or Logo */}
        <div className="text-center">
          {/* <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-sm text-muted-foreground">Please log in or sign up to continue</p> */}
        </div>
        {children}
      </div>
    </div>
  )
}