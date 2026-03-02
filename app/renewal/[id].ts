import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Invalid id' });
  const numericId = parseInt(id as string, 10);

  if (req.method === 'GET') {
    const [rows] = await db.execute<any[]>('SELECT * FROM renewals WHERE id=?', [numericId]);
    res.status(200).json(rows[0] || null);
  } else if (req.method === 'PUT') {
    const { clientName, companyName, contactPerson, emailOrNumber, office, expiryDate, renewedDate } = req.body;
    await db.execute(
      `UPDATE renewals SET clientName=?, companyName=?, contactPerson=?, emailOrNumber=?, office=?, expiryDate=?, renewedDate=? WHERE id=?`,
      [clientName, companyName, contactPerson, emailOrNumber, office, expiryDate, renewedDate, numericId]
    );
    res.status(200).json({ id: numericId, ...req.body });
  } else if (req.method === 'DELETE') {
    await db.execute('DELETE FROM renewals WHERE id=?', [numericId]);
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}