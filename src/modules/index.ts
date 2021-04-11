import express from 'express';
import { emailRegistrationRouter } from './email-registration';

const router = express.Router();

router.use('/email', emailRegistrationRouter);

export { router };
