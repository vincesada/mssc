import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const data = await req.json();
    const { clientName, companyName, contactPerson, emailOrNumber, office, expiryDate, renewedDate } = data;
    await db.execute(
      'UPDATE renewals SET clientName=?, companyName=?, contactPerson=?, emailOrNumber=?, office=?, expiryDate=?, renewedDate=? WHERE id=?',
      [clientName, companyName ?? null, contactPerson ?? null, emailOrNumber ?? null, office, expiryDate, renewedDate, id]
    );
    return NextResponse.json({ id: Number(id), ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update renewal' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await db.execute('DELETE FROM renewals WHERE id = ?', [id]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete renewal' }, { status: 500 });
  }
}