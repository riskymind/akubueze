import { DefaultSession } from 'next-auth';
// import NextAuth from 'next-auth';

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string;
//       email: string;
//       name: string;
//       role: string;
//     };
//   }

//   interface User {
//     id: string;
//     email: string;
//     name: string;
//     role: string;
//   }
// }

declare module 'next-auth' {
  export interface Session {
    user: {
      role: string;
    } & DefaultSession['user'];
  }
}

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//     role: string;
//   }
// }
