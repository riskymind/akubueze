import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const HomePage = async () => {
    const session =  await auth()

    if(session) {
        redirect('/dashboard');
    }

   return (
  <div className="relative min-h-screen flex items-center justify-center">
    {/* Background image */}
    <div
      className="absolute inset-0 bg-[url('/images/logo.jpeg')] bg-contain bg-center"
    />

    {/* Shadow overlay */}
    <div className="absolute inset-0 bg-black/60" />

    {/* Content */}
    <div className="relative z-10 text-center px-6">
      {/* Spinner */}
      {/* <div className="w-20 h-20 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div> */}
        <Image
        src="/images/logo.jpeg"
        alt="Akubueze Logo"
        width={80}
        height={80}
        className="mx-auto mb-4 rounded-r-lg rounded-l-lg"
        />
      {/* Branding */}
      <h2 className="text-3xl font-extrabold text-white mb-2">
        Akubueze Age Grade
      </h2>
      <p className="text-gray-200 mb-6">
        Building unity, accountability, and progress
      </p>

      {/* Call to action */}
       <Button asChild>
        <Link href='/sign-in'>
          <UserIcon /> Sign In
        </Link>
      </Button>
    </div>
  </div>
);
}
 
export default HomePage;