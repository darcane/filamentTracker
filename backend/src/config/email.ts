import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const EMAIL_CONFIG = {
  apiKey: process.env.RESEND_API_KEY || '',
  fromEmail: process.env.FROM_EMAIL || 'noreply@filamentory.com',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  appName: 'Filamentory',
};

export const EMAIL_TEMPLATES = {
  magicLink: {
    subject: 'Sign in to Filamentory',
    getHtml: (magicLink: string, code: string) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign in to Filamentory</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1976d2; }
            .button { display: inline-block; background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
            .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 18px; text-align: center; margin: 20px 0; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Filamentory</div>
            <p>Your 3D Printer Filament Tracker</p>
          </div>
          
          <h2>Hi there! 👋</h2>
          
          <p>Click the button below to sign in to your Filamentory account:</p>
          
          <div style="text-align: center;">
            <a href="${magicLink}" class="button">Sign In to Filamentory</a>
          </div>
          
          <p>Or enter this code manually:</p>
          <div class="code">${code}</div>
          
          <p><strong>Important:</strong> This link expires in 15 minutes and can only be used once.</p>
          
          <p>Didn't request this? You can safely ignore this email.</p>
          
          <div class="footer">
            <p>Filamentory - Your 3D Printer Filament Tracker</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </body>
      </html>
    `,
    getText: (magicLink: string, code: string) => `
Sign in to Filamentory

Hi there!

Click the link below to sign in to your Filamentory account:
${magicLink}

Or enter this code manually: ${code}

This link expires in 15 minutes and can only be used once.

Didn't request this? You can safely ignore this email.

---
Filamentory - Your 3D Printer Filament Tracker
    `.trim(),
  },
};
