import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';

export class NodeMailer {
  private static initiateTransport() {
    return nodeMailer.createTransport(
      SendGrid({
        auth: {
          api_key: 'SENDGRID_PASSWORD',
        },
      })
    );
  }

  static sendMail(data: { to: [string]; subject: string; html: string }) {
    NodeMailer.initiateTransport().sendMail({
      from: 'akmalcert@gmail.com',
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
