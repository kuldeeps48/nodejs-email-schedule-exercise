import { createTransport, createTestAccount, getTestMessageUrl } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import schedule, { Job } from 'node-schedule';
import { getRepository } from 'typeorm';
import EmailRegistration from '../model/email-registration';

class OnboardingMailService {
  private emailQueue: string[] = [];
  private mailTransporter: Mail;
  private job: Job;

  public async init() {
    await this.initializeMailTransport();

    // Fetch registered emails from DB whose onboarding mail is yet to be sent incase server was shutdown. Queue them if found.
    const emails = await getRepository(EmailRegistration).find({
      where: {
        sentHelloMail: false,
      },
    });

    if (emails?.length > 0) {
      this.emailQueue = emails.map((e) => e.email);
    }

    // Schedule a job to send onboarding mail by checking every 10 seconds.
    this.job = schedule.scheduleJob(
      'Send onboarding mail',
      {
        second: 10,
      },
      () => this.sendOnboardingMail()
    );
  }

  public stop() {
    this.job?.cancel();
  }

  /**
   * Send onboarding 'Hello' mail to given email address.
   *
   * @param {string} email
   * @memberof OnboardingMailService
   */
  public onboard(email: string) {
    console.log(`Queued ${email} for onboarding mail.`);
    this.emailQueue.push(email);
  }

  private async sendOnboardingMail() {
    try {
      if (this.emailQueue.length > 0) {
        const emails = Array.from(this.emailQueue);
        this.emailQueue = [];

        await Promise.allSettled(emails.map((e) => this.sendMailAndUpdateDB(e)));
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async sendMailAndUpdateDB(email: string): Promise<void> {
    try {
      const info = await this.mailTransporter.sendMail({
        from: '"Node Exercise" <exercise@example.com>',
        to: email,
        subject: 'Onboard',
        text: 'Hello. Your email has been registered.',
        html: '<b>Hello. Your email has been registered.</b>',
      });

      await getRepository(EmailRegistration).update(
        {
          email,
        },
        { sentHelloMail: true }
      );

      // Log preview URL if using ethereal mail
      if (process.env.USE_ETHEREAL_MAIL === 'true') {
        console.log(`Email preview URL: ${getTestMessageUrl(info)}`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async initializeMailTransport() {
    if (process.env.USE_ETHEREAL_MAIL === 'true') {
      const testAccount = await createTestAccount();
      this.mailTransporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      this.mailTransporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Boolean(process.env.SMTP_SECURE),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      } as any);
    }
  }
}

const onboardingMailService = new OnboardingMailService();

export default onboardingMailService;
