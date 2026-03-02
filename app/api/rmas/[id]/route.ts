import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const data = await req.json();
    const { itemReturned, purchasedDate, warranty, repairType, companyName, contactPerson, emailOrNumber } = data;
    await db.execute(
      'UPDATE rmas SET itemReturned=?, purchasedDate=?, warranty=?, repairType=?, companyName=?, contactPerson=?, emailOrNumber=? WHERE id=?',
      [itemReturned, purchasedDate, warranty ? 1 : 0, repairType, companyName ?? null, contactPerson ?? null, emailOrNumber ?? null, id]
    );
    return NextResponse.json({ id: Number(id), ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update rma' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await db.execute('DELETE FROM rmas WHERE id = ?', [id]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete rma' }, { status: 500 });
  }
}