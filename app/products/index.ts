import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (req.method === 'GET') {
    const [rows] = await db.execute<any[]>('SELECT * FROM products WHERE id = ?', [id]);
    return res.status(200).json(rows[0] || null);
  }

  if (req.method === 'PUT') {
    const { name, category, description, quantity, image } = req.body;

    await db.execute(
      `UPDATE products 
       SET name = ?, category = ?, description = ?, quantity = ?, image = ?
       WHERE id = ?`,
      [name, category, description || null, quantity, image || null, id]
    );

    return res.status(200).json({ id, name, category, description, quantity, image });
  }

  if (req.method === 'DELETE') {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return res.status(204).end();
  }

  res.status(405).end();
}