
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { connectSQLite } from "@/lib/db"; 

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await connectSQLite();
    const query = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);`;

    await db.run(query, [ username, email, hashedPassword ]);
    await db.close();

    return NextResponse.json({ message: "User registration." }, { status: 201 });
  } catch (error) {
    console.error("Registration error: ", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
