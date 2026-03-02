import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const [rows] = await db.execute('SELECT * FROM schedules WHERE id = ?', [id]);
    return NextResponse.json((rows as any)[0] || null);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const data = await req.json();
    const { title, description, datetime, location, clientType, company, contact, emailOrNumber } = data;
    await db.execute(
      'UPDATE schedules SET title=?, description=?, datetime=?, location=?, clientType=?, company=?, contact=?, emailOrNumber=? WHERE id=?',
      [title, description, datetime, location, clientType, company, contact, emailOrNumber, id]
    );
    return NextResponse.json({ id: Number(id), ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await db.execute('DELETE FROM schedules WHERE id = ?', [id]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
  }
}