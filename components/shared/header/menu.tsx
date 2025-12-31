import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ThemeSwitch } from './theme-switch'
import UserButton from './user-button'


const Menu = () => {
  return (
    <div className='flex justify-end items-center gap-2'>
      <nav className='hidden md:flex w-full gap-1 max-w-xs'>
        <ThemeSwitch />
        <UserButton />
      </nav>
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle'>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent className='flex flex-col items-start'>
            <SheetTitle className='m-4 border-b'>Menu</SheetTitle>
            <ThemeSwitch />
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
