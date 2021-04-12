import { getRepository } from 'typeorm';
import { DuplicateError } from '../../../lib/errors';
import EmailRegistration from '../model/email-registration';
import onboardingMailService from './onboarding-mail-service';

export async function registerNewEmail(email: string): Promise<void> {
  const duplicateEmail = await isEmailRegistered(email);
  if (duplicateEmail) {
    throw new DuplicateError(`Email ${email} is already registered.`);
  }

  // Register email
  const newEmailRegistration = new EmailRegistration();
  newEmailRegistration.email = email;
  newEmailRegistration.sentHelloMail = false;
  await getRepository(EmailRegistration).save(newEmailRegistration);
  console.log(`Registered new email:${email}`);

  // Send 'Hello' mail
  onboardingMailService.onboard(email);
}

async function isEmailRegistered(email: string): Promise<boolean> {
  const existingEmailRegistration = await getRepository(EmailRegistration).findOne({
    where: {
      email,
    },
  });

  return existingEmailRegistration ? true : false;
}
