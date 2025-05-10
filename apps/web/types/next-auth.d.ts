
// declare module "next-auth" {
//     interface Session {
//       user: {
//         id: string;
//         fullName?: string | null;
//         email?: string | null;
//         image?: string | null;
//         token?: string | null;
//       };
//     }
  
//     interface User {
//       id: string;
//       fullName?: string | null;
//       email?: string | null;
//       image?: string | null;
//       token?: string | null;
//     }
//   }
  
//   declare module "next-auth/jwt" {
//     interface JWT {
//       user?: {
//         id: string;
//         fullName?: string | null;
//         email?: string | null;
//         image?: string | null;
//         token?: string | null;
//       };
//     }
//   }