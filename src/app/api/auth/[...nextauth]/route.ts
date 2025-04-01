import { AuthOptions, RequestInternal } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: { email: string; password: string } | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) {
        if (!credentials) {
          return null;
        }
        // Add your authentication logic here
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 