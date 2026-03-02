import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM installations');
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch installations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { project, company, dateTime, location, devices } = data;
    const [result] = await db.execute(
      'INSERT INTO installations (project, company, dateTime, location, devices) VALUES (?, ?, ?, ?, ?)',
      [project, company, dateTime, location, typeof devices === 'string' ? devices : JSON.stringify(devices)]
    );
    const insertId = (result as any).insertId;
    return NextResponse.json({ id: insertId, ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create installation' }, { status: 500 });
  }
}