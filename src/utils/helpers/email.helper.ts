import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { EMAIL_NAME, EMAIL_PASS } from "../../constants/env";
import { ResponseHelper } from "./response.helper";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "../../constants/status.constants";

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: any;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Your SMTP host
      port: 587, // Your SMTP port
      secure: false, // true for 465, false for other ports
      service: "gmail",
      auth: {
        user: `${EMAIL_NAME}`, // Your SMTP user
        pass: `${EMAIL_PASS}`, // Your SMTP password
      },
    });
  }

  private loadTemplate(templateName: string, context: any): string {
    const templatePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.html`
    );
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(templateSource);
    return template(context);
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    const html = this.loadTemplate(options.template, options.context);

    const mailOptions = {
      from: `Stack <${EMAIL_NAME}>`,
      to: options.to,
      subject: options.subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      ResponseHelper.httpErrorResponse(
        "No internet connection to send mail",
        HTTP_STATUS_INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default EmailService;
