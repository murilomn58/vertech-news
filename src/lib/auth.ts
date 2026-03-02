import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    signIn({ profile }) {
      const allowed = (process.env.AUTHORIZED_ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase());
      return allowed.includes(profile?.email?.toLowerCase() || "");
    },
    session({ session }) {
      return session;
    },
  },
});
