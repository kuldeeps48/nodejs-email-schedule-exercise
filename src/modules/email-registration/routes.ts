import express from 'express';
import { validate } from 'express-validation';
import { emailRegistrationPayload } from './validations';
import { registerEmail } from './controllers/register-email';

const emailRegistrationRouter = express.Router();
emailRegistrationRouter.post('/register', validate(emailRegistrationPayload), registerEmail);

export { emailRegistrationRouter };
