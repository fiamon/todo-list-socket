import 'dotenv/config';
import { transporter } from './nodemailer.config';

const mailOptions = {
  from: `${process.env.MAILER_USER}`,
  to: '',
  subject: 'Você foi convidado para participar de uma to-do list!',
  text: 'Você foi convidado para particar de uma to-do list',
};

export async function sendMail(receiverEmail: string) {
  mailOptions.to = receiverEmail;
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return error;
    }
    return info;
  });
}
