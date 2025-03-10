import { NextResponse } from 'next/server';
import { connectSQLite } from '@/lib/db';

export async function GET() {
  try {
    const db = await connectSQLite();
    
    const query = `SELECT * FROM components;`;
    
    const components = await db.all(query);
    await db.close();

    return NextResponse.json(components.map(component => ({
      id: component.component_id,
      name: component.component_name,
      add_price: component.add_price
    })));

  } catch (error) {
    console.error('Components fetch error:', error);
    return NextResponse.json({ 
      error: 'Error fetching components'
    }, { status: 500 });
  }
}