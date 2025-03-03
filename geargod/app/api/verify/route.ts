
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function connectSQLite() {
  return open({
    filename: 'geargod.db',
    driver: sqlite3.Database
  });
}

export async function POST(req: Request) {
  try {
    const db = await connectSQLite();
    const query = `SELECT id FROM users WHERE username = ?`

    const { username } = await req.json();

    const user = await db.get(query, [ username ]);
    await db.close();

    console.log("User: ", user);

    return NextResponse.json({ user });
  } catch(error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred checking user" }, { status: 500 });
  }
}