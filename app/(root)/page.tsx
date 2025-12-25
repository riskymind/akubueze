"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react"


const HomePage = () => {
    // const router = useRouter()
    // const {data: session, status} = useSession()

    // useEffect(()=> {
    //     if(status == "loading") return;
    //     if(session) {
    //         router.push("/dashboard")
    //     }else {
    //         router.push("/login")
    //     }
    // }, [session, status, router])

    return ( 
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-green-50 to-blue-50">
            <div className="text-center">
                <div className="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Akubueze Age Grade</h2>
                <p className="text-gray-600">Loading....</p>
            </div>

            <p>Make this screen more about akubueze</p>
            <h1>Add a Sign in button</h1>
            
        </div>
     );
}
 
export default HomePage;