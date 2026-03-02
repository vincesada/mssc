import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Invalid id' });
  const numericId = parseInt(id as string, 10);

  if (req.method === 'GET') {
    const [rows] = await db.execute<any[]>('SELECT * FROM rmas WHERE id=?', [numericId]);
    res.status(200).json(rows[0] || null);
  } else if (req.method === 'PUT') {
    const { itemReturned, purchasedDate, warranty, repairType, companyName, contactPerson, emailOrNumber } = req.body;
    await db.execute(
      `UPDATE rmas SET itemReturned=?, purchasedDate=?, warranty=?, repairType=?, companyName=?, contactPerson=?, emailOrNumber=? WHERE id=?`,
      [itemReturned, purchasedDate, warranty, repairType, companyName, contactPerson, emailOrNumber, numericId]
    );
    res.status(200).json({ id: numericId, ...req.body });
  } else if (req.method === 'DELETE') {
    await db.execute('DELETE FROM rmas WHERE id=?', [numericId]);
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}