import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM products');
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, category, description, quantity, image } = data;
    const [result] = await db.execute(
      'INSERT INTO products (name, category, description, quantity, image) VALUES (?, ?, ?, ?, ?)',
      [name, category, description ?? null, quantity, image ?? null]
    );
    const insertId = (result as any).insertId;
    return NextResponse.json({ id: insertId, ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}