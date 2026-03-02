import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const [rows] = await db.execute<any[]>('SELECT * FROM renewals ORDER BY created_at DESC');
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    const { clientName, companyName, contactPerson, emailOrNumber, office, expiryDate, renewedDate } = req.body;
    const [result] = await db.execute<any>(
      `INSERT INTO renewals (clientName, companyName, contactPerson, emailOrNumber, office, expiryDate, renewedDate)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [clientName, companyName, contactPerson, emailOrNumber, office, expiryDate, renewedDate]
    );
    res.status(201).json({ id: (result as any).insertId, ...req.body });
  } else {
    res.status(405).end();
  }
}