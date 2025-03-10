import NextAuth, { SessionStrategy, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectSQLite } from '@/lib/db';

declare module "next-auth" {
    interface Session {
        user: User & {
            roles: string;
            username: string;
        };
    }
    interface User {
        roles: string;
        username: string;
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("✅ authorize() called with:", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    // ! console.log("❌ Missing credentials:", credentials);
                    return null;
                }

                try {
                    console.log("🛠 Connecting to SQLite...");
                    const db = await connectSQLite();
                    const query = `SELECT * FROM users WHERE email = ?`;

                    console.log("🔎 Searching for user from email:", credentials.email);
                    const user = await db.get(query, [credentials.email]);
                    await db.close();

                    if (!user) {
                        console.log("❌ User not found!");
                        return null;
                    }

                    console.log("✅ User found:", user);
                    console.log("🔑 Comparing passwords...");

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);

                    if (!passwordMatch) {
                        console.log("❌ Password incorrect!");
                        return null;
                    }

                    console.log("🎉 Authentication successful!");
                    // ? Return only necessary user data
                    // * console.log("🎉🎉🎉", user.roles);
                    return {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        roles: user.roles
                    };
                } catch (error) {
                    console.log("🚨 Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as SessionStrategy
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: User | undefined }) {
            if (user) {
                token.roles = user.roles;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session?.user) {
                session.user.roles = token.roles as string;
                session.user.username = token.username as string;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
