import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Role } from './generated/prisma/enums'

export async function requireAdmin() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect('/unauthorized')
  }

  return session
}
