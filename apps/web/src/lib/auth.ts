import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Test Mode",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        try {
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email === 'test@example.com' ? 'Autonomous Demo User' : 'Test User',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user'
              }
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: (user as any).image,
          };
        } catch (e) {
          console.error('Database connection failed during login.');
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
