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
        // Simple bypass for testing
        if (!credentials?.email) return null;
        
        // HARDCORE BYPASS: If test user, don't even touch the DB if it might be down
        if (credentials.email === 'test@example.com') {
          return {
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User (Offline)',
          };
        }

        try {
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: 'Test User',
              }
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (e) {
          console.error('Database connection failed during login, but allowing test bypass.');
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
