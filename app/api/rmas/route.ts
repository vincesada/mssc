import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM rmas');
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch rmas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { itemReturned, purchasedDate, warranty, repairType, companyName, contactPerson, emailOrNumber } = data;
    const [result] = await db.execute(
      'INSERT INTO rmas (itemReturned, purchasedDate, warranty, repairType, companyName, contactPerson, emailOrNumber) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [itemReturned, purchasedDate, warranty ? 1 : 0, repairType, companyName ?? null, contactPerson ?? null, emailOrNumber ?? null]
    );
    const insertId = (result as any).insertId;
    return NextResponse.json({ id: insertId, ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create rma' }, { status: 500 });
  }
}   