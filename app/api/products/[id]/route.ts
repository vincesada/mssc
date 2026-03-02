import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const data = await req.json();
    const { name, category, description, quantity, image } = data;
    await db.execute(
      'UPDATE products SET name=?, category=?, description=?, quantity=?, image=? WHERE id=?',
      [name, category, description ?? null, quantity, image ?? null, id]
    );
    return NextResponse.json({ id: Number(id), ...data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}