import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CredentialsSigninForm from "./credentials-signin-form";

const SignInPage =  async (props: {
    searchParams: Promise<{callbackUrl: string}>
}) => {
    const {callbackUrl} = await props.searchParams;
    const session = await auth()

    if(session) {
        return redirect(callbackUrl || "/dashboard")
    }

    return ( 
        <div className="w-full max-w-md mx-auto">
            <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex items-center justify-center'>
            <Image
              src='/images/logo.png'
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>
          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <CredentialsSigninForm />
        </CardContent>
      </Card>
        </div>
     );
}
 
export default SignInPage;