import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM schedules');
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { title, description, datetime, location, clientType, company, contact, emailOrNumber } = data;
    const [result] = await db.execute(
      'INSERT INTO schedules (title, description, datetime, location, clientType, company, contact, emailOrNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, datetime, location, clientType, company, contact, emailOrNumber]
    );
    const insertId = (result as any).insertId;
    return NextResponse.json({ id: insertId, ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}