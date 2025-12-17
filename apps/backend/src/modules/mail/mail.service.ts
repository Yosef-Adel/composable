import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    this.from = this.configService.get<string>(
      'SMTP_FROM',
      'noreply@composable.dev',
    );

    // Create transporter
    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
      this.logger.log('Mail service initialized with SMTP configuration');
    } else {
      this.logger.warn(
        'Mail service: SMTP configuration incomplete. Emails will not be sent.',
      );
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        this.logger.warn(
          'Mail transporter not configured. Skipping email send.',
        );
        return false;
      }

      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      this.logger.log(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }

  async sendVerificationEmail(email: string, otp: string): Promise<boolean> {
    const templatePath = path.join(__dirname, 'templates', 'verify-email.hbs');
    let html: string;

    try {
      html = fs.readFileSync(templatePath, 'utf-8').replace('{{otp}}', otp);
    } catch {
      this.logger.warn('Could not read email template, using plain text');
      html = `<h1>Verify Your Email</h1><p>Your OTP: <strong>${otp}</strong></p><p>Expires in 10 minutes.</p>`;
    }

    return this.sendEmail({
      to: email,
      subject: 'Email Verification - Composable',
      html,
    });
  }

  async verifyTransporter(): Promise<boolean> {
    try {
      if (this.transporter) {
        await this.transporter.verify();
        this.logger.log('Mail transporter verified successfully');
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error('Mail transporter verification failed:', error);
      return false;
    }
  }
}
