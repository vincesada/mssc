import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const [rows] = await db.execute<any[]>('SELECT * FROM rmas ORDER BY created_at DESC');
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    const { itemReturned, purchasedDate, warranty, repairType, companyName, contactPerson, emailOrNumber } = req.body;
    const [result] = await db.execute<any>(
      `INSERT INTO rmas (itemReturned, purchasedDate, warranty, repairType, companyName, contactPerson, emailOrNumber)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [itemReturned, purchasedDate, warranty, repairType, companyName, contactPerson, emailOrNumber]
    );
    res.status(201).json({ id: (result as any).insertId, ...req.body });
  } else {
    res.status(405).end();
  }
}