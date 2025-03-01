
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";

async function connectSQLite() {
    return open({
        filename: "geargod.db",
        driver: sqlite3.Database
    });
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials/*, req*/) {
                console.log("✅ authorize() called with:", credentials);

                if (!credentials?.username || !credentials?.password) {
                    console.log("❌ Missing credentials:", credentials);
                    return null;
                }

                try {
                    console.log("🛠 Connecting to SQLite...");
                    const db = await connectSQLite();

                    console.log("🔎 Searching for user:", credentials.username);
                    const user = await db.get("SELECT * FROM users WHERE username = ?", [credentials.username]);

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
                    return user;
                } catch (error) {
                    console.log("🚨 Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
