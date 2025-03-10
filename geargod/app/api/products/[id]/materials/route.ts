import { NextResponse } from 'next/server';
import { connectSQLite } from '@/lib/db';

export async function GET() {
  try {
    const db = await connectSQLite();
    
    const query = `
      SELECT 
        material_id as id,
        material_name as name,
        CAST(add_price AS INTEGER) as add_price
      FROM materials;
    `;
    
    const materials = await db.all(query);
    await db.close();

    // Convert types explicitly
    const formattedMaterials = materials.map(material => ({
      id: String(material.id),
      name: String(material.name),
      add_price: Number(material.add_price)
    }));

    return NextResponse.json(formattedMaterials);

  } catch (error) {
    console.error('Materials fetch error:', error);
    return NextResponse.json({ 
      error: 'Error fetching materials'
    }, { status: 500 });
  }
}