import { NextFunction, Request, Response } from 'express';
import { registerNewEmail } from '../service/email-registration-service';

export async function registerEmail(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { email } = req.body ?? {};
    await registerNewEmail(email);
    return res.status(200).json({ message: 'Email registered successfully.' });
  } catch (err) {
    console.error(err);
    next(err);
  }
}
