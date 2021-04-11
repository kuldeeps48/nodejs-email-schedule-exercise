# nodejs-email-schedule-exercise

An express server which takes emails and sends them "Hello" mail using a scheduler.

## Steps to run

- Create a .env file using .example-env
- Configure .env variables if any change is required.
- Install all packages using 'npm install'
- Start server with 'npm start'

## Steps to register email

- Perform a POST call on http://localhost:5000/v1/email/register with your email in JSON body.
  Example body: {
  "email": "kuldeeps48@gmail.com"
  }
- Your email will be registered if it's not already registered and a preview link will be logged by server to view 'hello' mail sent to user when using ethereal mail.

### Uses

- express
- typeorm
- nodemailer
- node-schedule
