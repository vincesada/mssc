import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const data = await req.json();
    const { project, company, dateTime, location, devices } = data;
    await db.execute(
      'UPDATE installations SET project=?, company=?, dateTime=?, location=?, devices=? WHERE id=?',
      [project, company, dateTime, location, typeof devices === 'string' ? devices : JSON.stringify(devices), id]
    );
    return NextResponse.json({ id: Number(id), ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update installation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await db.execute('DELETE FROM installations WHERE id = ?', [id]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete installation' }, { status: 500 });
  }
}