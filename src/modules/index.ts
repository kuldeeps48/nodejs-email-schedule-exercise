import express from 'express';
import { emailRegistrationRouter, EmailRegistration } from './email-registration';

const router = express.Router();
router.use('/email', emailRegistrationRouter);

const models = [EmailRegistration];

export { router, models };
