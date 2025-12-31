"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const CredentialsSigninForm = () => {

    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message:""
    })
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    const SignInButton = () => {
        const { pending } = useFormStatus()
        return (
            <Button disabled={pending} className="w-full" variant="default">
                {pending ? "Signing In..." : "Sign In"}
            </Button>
        )
    }
    return (  
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-6">
                <div>
                    <Label htmlFor="email" className="my-1.5">Email</Label>
                    <Input 
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        defaultValue={signInDefaultValues.email}/>
                </div>

                <div>
                    <Label htmlFor="password" className="my-1.5">Password</Label>
                    <Input 
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="password"
                        defaultValue={signInDefaultValues.password}/>
                </div>
                <div className="w-full text-right">
                     <Link
                href="/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Forgot password?
              </Link>
                </div>
                <div>
                    <SignInButton />
                </div>

                {
                    data && !data.success && (
                        <div className="text-center text-destructive">
                            {data.message}
                        </div>
                    )
                }

                <div className="text-sm text-center text-muted-foreground">
                    {/* Don&apos;t have an account?{" "}
                    <Link href="/sign-up" target="_self" className="link text-green-600 hover:text-green-500">
                    Contact admin
                    </Link> */}
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">
                    <p>For support, contact the financial secretary</p>
                </div>
            </div>
        </form>
    );
}
 
export default CredentialsSigninForm;