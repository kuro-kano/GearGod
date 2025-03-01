
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function connectSQLite() {
  return open({
    filename: "geargod.db",
    driver: sqlite3.Database,
  });
}

export async function POST(req: Request) {
  try {
    console.log("Connected to database!");
    const db = await connectSQLite();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.get(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      await db.close();
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Insert user into database
    await db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );

    await db.close();
    return NextResponse.json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
