import Image from 'next/image'
import Link from 'next/link'
import {redirect} from 'next/navigation';
import React, { ReactNode } from 'react'
import {getCurrentUser} from "@/lib/actions/auth.actions";

const Layout = async ({ children }: { children: ReactNode }) => {
    const isAuthenticated = await getCurrentUser();

    if (!isAuthenticated) redirect('/sign-in');
  return (
    <div className='root-layout'>
      <nav>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='logo' width={38} height={32} />
          <h2 className='text-white/20'>NunoWise</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default Layout