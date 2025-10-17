import { Resend } from 'resend';
import { EMAIL_CONFIG, EMAIL_TEMPLATES } from '../config/email';

export class EmailService {
  private resend: Resend | null = null;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !!EMAIL_CONFIG.apiKey && EMAIL_CONFIG.apiKey.length > 0;
    
    if (this.isEnabled) {
      this.resend = new Resend(EMAIL_CONFIG.apiKey);
      console.log('✅ Email service enabled with Resend');
    } else {
      console.warn('⚠️  Email service disabled: RESEND_API_KEY not configured');
    }
  }

  async sendMagicLink(email: string, magicLink: string, code: string): Promise<void> {
    if (!this.isEnabled || !this.resend) {
      console.warn(`⚠️  Email service disabled: Magic link for ${email} would be: ${magicLink}`);
      console.warn(`⚠️  Code: ${code}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: EMAIL_CONFIG.fromEmail,
        to: [email],
        subject: EMAIL_TEMPLATES.magicLink.subject,
        html: EMAIL_TEMPLATES.magicLink.getHtml(magicLink, code),
        text: EMAIL_TEMPLATES.magicLink.getText(magicLink, code),
      });

      console.log(`✅ Magic link sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send magic link:', error);
      throw new Error('Failed to send magic link email');
    }
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    if (!this.isEnabled || !this.resend) {
      console.warn(`⚠️  Email service disabled: Welcome email for ${email} skipped`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: EMAIL_CONFIG.fromEmail,
        to: [email],
        subject: `Welcome to ${EMAIL_CONFIG.appName}!`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Filamentory</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; color: #1976d2; }
                .button { display: inline-block; background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo">Filamentory</div>
                <p>Your 3D Printer Filament Tracker</p>
              </div>
              
              <h2>Welcome to Filamentory! 🎉</h2>
              
              <p>Thank you for joining Filamentory! You can now start tracking your 3D printer filament inventory with ease.</p>
              
              <h3>What you can do:</h3>
              <ul>
                <li>📦 Track your filament inventory</li>
                <li>📝 Add notes and tips for your projects</li>
                <li>📊 Monitor your filament usage</li>
                <li>💰 Keep track of costs and budgets</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${EMAIL_CONFIG.appUrl}" class="button">Get Started</a>
              </div>
              
              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <div class="footer">
                <p>Filamentory - Your 3D Printer Filament Tracker</p>
                <p>Happy printing! 🖨️</p>
              </div>
            </body>
          </html>
        `,
        text: `
Welcome to Filamentory!

Thank you for joining Filamentory! You can now start tracking your 3D printer filament inventory with ease.

What you can do:
- Track your filament inventory
- Add notes and tips for your projects
- Monitor your filament usage
- Keep track of costs and budgets

Get started: ${EMAIL_CONFIG.appUrl}

If you have any questions, feel free to reach out to our support team.

---
Filamentory - Your 3D Printer Filament Tracker
Happy printing! 🖨️
        `.trim(),
      });

      console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't throw error for welcome email as it's not critical
    }
  }
}

export const emailService = new EmailService();
