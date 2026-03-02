import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Invalid id' });
  const numericId = parseInt(id as string, 10);

  if (req.method === 'GET') {
    const [rows] = await db.execute<any[]>('SELECT * FROM installations WHERE id=?', [numericId]);
    if (!rows[0]) return res.status(404).json(null);
    res.status(200).json({ ...rows[0], devices: JSON.parse(rows[0].devices) });
  } else if (req.method === 'PUT') {
    const { project, company, dateTime, location, devices } = req.body;
    await db.execute(
      `UPDATE installations SET project=?, company=?, dateTime=?, location=?, devices=? WHERE id=?`,
      [project, company, dateTime, location, JSON.stringify(devices), numericId]
    );
    res.status(200).json({ id: numericId, ...req.body });
  } else if (req.method === 'DELETE') {
    await db.execute('DELETE FROM installations WHERE id=?', [numericId]);
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}