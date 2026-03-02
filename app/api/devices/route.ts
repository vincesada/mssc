import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM devices');
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, type } = data;
    const [result] = await db.execute(
      'INSERT INTO devices (name, type) VALUES (?, ?)',
      [name, type]
    );
    const insertId = (result as any).insertId;
    return NextResponse.json({ id: insertId, ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create device' }, { status: 500 });
  }
}