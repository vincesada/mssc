import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const [rows] = await db.execute('SELECT * FROM products ORDER BY id DESC');
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { name, category, description, quantity, image } = req.body;

    // Important: include image in INSERT
    const [result] = await db.execute(
      `INSERT INTO products (name, category, description, quantity, image)
       VALUES (?, ?, ?, ?, ?)`,
      [name, category, description || null, quantity, image || null]  // ← image goes here
    );

    return res.status(201).json({
      id: (result as any).insertId,
      name,
      category,
      description,
      quantity,
      image,          // ← return it so frontend sees it immediately
    });
  }

  res.status(405).end();
}