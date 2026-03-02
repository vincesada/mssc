import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM renewals');
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch renewals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { clientName, companyName, contactPerson, emailOrNumber, office, expiryDate, renewedDate } = data;
    const [result] = await db.execute(
      'INSERT INTO renewals (clientName, companyName, contactPerson, emailOrNumber, office, expiryDate, renewedDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [clientName, companyName ?? null, contactPerson ?? null, emailOrNumber ?? null, office, expiryDate, renewedDate]
    );
    const insertId = (result as any).insertId;
    return NextResponse.json({ id: insertId, ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create renewal' }, { status: 500 });
  }
}