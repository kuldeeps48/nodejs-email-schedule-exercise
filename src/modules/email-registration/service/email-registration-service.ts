import { getRepository } from 'typeorm';
import { DuplicateError } from '../../../lib/errors';
import EmailRegistration from '../model/email-registration';
import onboardingMailService from './onboarding-mail-service';

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
  console.log(`Registered new email:${email}`);

  // Queue 'Hello' mail
  await onboardingMailService.onboard(email);
}

async function isEmailRegistered(email: string): Promise<boolean> {
  const existingEmailRegistration = await getRepository(EmailRegistration).findOne({
    where: {
      email,
    },
  });

  return existingEmailRegistration ? true : false;
}
