import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587, // or the port your SMTP server uses
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'api',
      pass: '94b76fdc1a97d9fa55dcb2b406c9a8f5',
    },
});

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}


export const sendMail = async ({to, subject, text, html}: MailOptions) => {
    const mailOptions = {
        from: 'noreply@pictamagic.com',
        to,
        subject,
        text,
        html,
    };

    await transporter.sendMail(mailOptions);
};