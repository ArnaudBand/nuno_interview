import React from 'react'
import {getCurrentUser} from "@/lib/actions/auth.actions";
import {redirect} from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = await getCurrentUser();

  if (isAuthenticated) redirect('/');
  return (
    <div className='auth-layout'>
      {children}
    </div>
  )
}

export default AuthLayout