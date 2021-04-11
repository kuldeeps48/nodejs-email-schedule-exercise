import { Request, Response } from 'express';

export async function registerEmail(req: Request, res: Response) {
  const { email } = req.body ?? {};
  // TODO: Check if email exists. If not, register it and queue 'hello' mail.
  return res.status(200).json({ message: 'Email registered successfully.' });
}
