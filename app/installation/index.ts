import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const [rows] = await db.execute<any[]>('SELECT * FROM installations ORDER BY created_at DESC');
    // parse devices from string
    const parsed = rows.map(r => ({ ...r, devices: JSON.parse(r.devices) }));
    res.status(200).json(parsed);
  } else if (req.method === 'POST') {
    const { project, company, dateTime, location, devices } = req.body;
    const [result] = await db.execute<any>(
      `INSERT INTO installations (project, company, dateTime, location, devices) VALUES (?, ?, ?, ?, ?)`,
      [project, company, dateTime, location, JSON.stringify(devices)]
    );
    res.status(201).json({ id: (result as any).insertId, ...req.body });
  } else {
    res.status(405).end();
  }
}