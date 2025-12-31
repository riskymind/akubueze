import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import MainNav from "@/app/(dashboard)/main-nav";

const Header = () => {
    return ( 
         <header className="w-full border-b">
        <div className="max-w-7xl lg:mx-auto p-5 md:px-10 w-full flex justify-between items-center">
            
            <div className="flex justify-start items-center">
                <Link href="/" className="flex justify-start items-center gap-2"> 
                    <Image 
                    src="/images/logo.jpeg" 
                    alt={`${APP_NAME} logo`} 
                    height={48} 
                    width={48} 
                    priority={true}
                    className="rounded-r-lg rounded-l-lg border border-gray-200 shadow-sm"/>
                    <span className="hidden lg:block font-semibold text-sm italic">
                        {APP_NAME}
                    </span>
                </Link>
            </div>
            <MainNav className='mx-6 md:flex flex-wrap'/>
            <Menu />
        </div>
    </header>
     );
}
 
export default Header;