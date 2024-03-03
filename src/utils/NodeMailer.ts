import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';
import { getEnvironmentVariables } from '../environments/environment';

export class NodeMailer {
  private static initiateTransport() {
    return nodeMailer.createTransport(
      // SendGrid({
      //   auth: {
      //     api_key: 'SENDGRID_PASSWORD',
      //   },
      // })

      // https://myaccount.google.com/lesssecureapps
      {
        service: 'gmail',
        auth: {
          user: getEnvironmentVariables().gmail_auth.user,
          pass: getEnvironmentVariables().gmail_auth.pass,
        },
      }
    );
  }

  static sendMail(data: {
    to: [string];
    subject: string;
    html: string;
  }): Promise<any> {
    return NodeMailer.initiateTransport().sendMail({
      from: getEnvironmentVariables().gmail_auth.user,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
