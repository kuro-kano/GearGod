// app/lib/db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function connectSQLite() {
  return open({
    filename: "geargod.db",
    driver: sqlite3.Database,
  });
}