import GoogleProvider from "next-auth/providers/google";
import { ISODateString, type AuthOptions } from "next-auth";
import prisma from "@repo/db/client"
import jwt from "jsonwebtoken"


export interface UserType {
  id: string;
  fullName?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string | null;
}

export interface CustomSession {
  user?: UserType;
  expires: ISODateString;
}


export const authOptions: AuthOptions = {
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email || !user.id) return false;
  
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email }
        });
  
        let myUser;
        if (existingUser) {
          myUser = await prisma.user.update({
            where: { email: user.email },
            data: {
              name: user.name,
              image: user.image,
            }
          });
        } else {
          myUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
            }
          });
        }
  
        const jwtPayload = {
          name: myUser.name,
          email: myUser.email,
          id: myUser.id
        };
  
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || "iambatman", { expiresIn: "365d" });
  
        user.id = myUser.id.toString();
        (user as any).token = token;
        return true;
  
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  
    async jwt({ token, user }) {
      if (user) {
        const customUser: UserType = {
          id: user.id,
          fullName: user.name,
          email: user.email,
          image: user.image,
          token: (user as any).token,
        };
        token.user = customUser;
      }
      return token;
    },
  
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as UserType;
      }
      return session;
    },
  
    async redirect({ url, baseUrl }) {
      return url.includes("/signin") || url.includes("/signout")
        ? url
        : `${baseUrl}/dashboard`;
    },
  }
};
