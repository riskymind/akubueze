import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { adapter } from "next/dist/server/web/adapter"
import { email } from "zod"
// import { authConfig } from "./a"

export const config = {
    pages: {
        signIn: "/sign-in",
        error: "/sign-in"
    },

    session: {
        strategy: "jwt" as const,
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },

    adapter: PrismaAdapter(prisma),

    providers: [
        CredentialsProvider({
            credentials: {
                email: {type: "email"},
                password: {type: "password"}
            },
            async authorize(credentials) {
                if(credentials == null) return null

                // Find user in DB
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                })

                 // Check if user exists and if the password matches
                if(user && user.password) {
                    const isMatch = await bcrypt.compare(
                        credentials.password as string, user.password
                    )

                    // If password is correct, return user
                    if(isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }   
                    }
                }
                // If user does not exist or password does not match return null
                return null
            }
        })
    ],
    callbacks: {
        // ...authConfig.callbacks,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({session, user, trigger, token}: any) {
            session.user.id = token.sub
            session.user.role = token.role
            session.user.name = token.name

            if(trigger === "update") {
                session.user.name = user.name
            }
            return session
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({token, user, trigger, session}: any) {
            // Assign user fields to token
            if(user) {
                token.id = user.id
                token.role = user.role
    
                // If user has no name then use the email
                if(user.name === "NO_NAME") {
                    token.name = user.email!.spil("@")[0]
    
                    await prisma.user.update({
                        where: {id: user.id},
                        data: {name: token.name}
                    })
                }
            }

            if(session?.user.name && trigger === "update") {
                token.name = session.user.name
            }

            return token
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export const {handlers, auth, signIn, signOut } = NextAuth(config)

export const hasAdminAccess = (role: string) => {
  return role === 'ADMIN' || role === 'FINANCIAL_SECRETARY';
};