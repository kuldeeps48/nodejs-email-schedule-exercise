import Joi from 'joi';

const emailRegistrationPayload = {
  body: Joi.object({
    email: Joi.string().email().trim().required(),
  }),
};

export { emailRegistrationPayload };
