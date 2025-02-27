import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret:process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn(params) {
      console.log(params);
      if (!params.user.email) {
        return false;
      }
      try {
        await prismaClient.user.create({
          data: {
            email: params.user.email,
            provider: "Google",
          },
        });
        
      } catch (error) {}

      return true;
    },
  },
});

export { handler as GET, handler as POST };
