'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const links = [
  {title: 'Dashboard', href: '/dashboard'},
  {title: 'Members',href: '/members'},
  {title: 'Meetings',href: '/meetings'},
  {title: 'Dues',href: '/dues'},
  {title: 'About us',href: '/about'},
];

// type MainNavProps = React.HTMLAttributes<HTMLElement> & {
//   onLinkClick?: () => void;
// };

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((item) => (
            <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-green-800',
              pathname.includes(item.href) ? 'text-green-500' : 'text-muted-foreground'
            )}
          >
            {item.title}
          </Link>
      ))}
    </nav>
  );
};

export default MainNav;
