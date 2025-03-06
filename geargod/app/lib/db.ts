// app/lib/db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from 'path';

export async function connectSQLite() {
  try {
    const dbPath = path.join(process.cwd(), 'geargod.db');
    console.log('Attempting to connect to database at:', dbPath);
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Test the connection
    await db.get('SELECT 1');
    console.log('Database connection successful');
    return db;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Failed to connect to database');
  }
}