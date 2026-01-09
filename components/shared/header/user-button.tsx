import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { Role } from '@/lib/generated/prisma/enums';
import Image from 'next/image';

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';
  const profileImage = session.user?.image ?? "/images/logo.jpeg"

  return (
    <div className='flex gap-2 items-center ml-4'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center'>
            {/* <Button
              variant='ghost'
              className='relativee w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200'
            > */}
               {/* <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"> */}
                <Image
                  src={profileImage}
                  height={32}
                  width={32}
                  className='rounded-full'
                  alt={firstInitial}/>
              {/* </div> */}
            {/* </Button> */}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 ml-4' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <div className='text-sm font-medium leading-none'>
                {session.user?.name}
              </div>
              <div className='text-sm text-muted-foreground leading-none'>
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href='/user/profile' className='w-full'>
              User Profile
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === Role.ADMIN && (
            <DropdownMenuItem>
              <Link href='/admin/users' className='w-full'>
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          {/* <DropdownMenuItem className='p-0 mb-1'> */}
            <form action={signOutUser} className='w-full'>
              <Button
                type='submit'
                className='w-full py-4 px-2 h-4 justify-start'
                variant='ghost'
              >
                Sign Out
              </Button>
            </form>
          {/* </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
