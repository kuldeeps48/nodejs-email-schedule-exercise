import { getRepository } from 'typeorm';
import { DuplicateError } from '../../../lib/errors';
import EmailRegistration from '../model/email-registration';

export async function registerNewEmail(email: string): Promise<void> {
  const isDuplicate = await isEmailRegistered(email);
  if (isDuplicate) {
    throw new DuplicateError(`Email ${email} is already registered.`);
  }

  // Save in DB
  const newEmailRegistration = new EmailRegistration();
  newEmailRegistration.email = email;
  newEmailRegistration.sentHelloMail = false;
  await getRepository(EmailRegistration).save(newEmailRegistration);

  //TODO: Queue 'Hello' mail
}

async function isEmailRegistered(email: string): Promise<boolean> {
  const existingEmailRegistration = await getRepository(EmailRegistration).findOne({
    where: {
      email,
    },
  });

  return existingEmailRegistration ? true : false;
}
