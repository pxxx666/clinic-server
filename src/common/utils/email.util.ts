import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailUtil {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // 邮箱服务商
      auth: {
        user: process.env.EMAIL_USER, // 你的QQ邮箱
        pass: process.env.EMAIL_PASSWORD, // QQ邮箱授权码
      },
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"智慧微诊所系统" <${process.env.EMAIL_USER}>`,
        to,
        subject: '智慧微诊所 - 邮箱验证码',
        text: `您的验证码是：${code}，5分钟内有效。`,
        html: this.getEmailTemplate(code),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('发送邮件失败:', error);
      throw new Error('邮件发送失败，请稍后重试');
    }
  }

  private getEmailTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>邮箱验证码</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
          }
          .logo {
            max-width: 150px;
          }
          .content {
            padding: 20px 0;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #1890ff;
            letter-spacing: 2px;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            display: inline-block;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1890ff;
            color: white !important;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://example.com/logo.png" alt="智慧微诊所" class="logo">
          <h2>邮箱验证码</h2>
        </div>
        
        <div class="content">
          <p>尊敬的智慧微诊所用户：</p>
          <p>您正在使用邮箱验证码服务，验证码为：</p>
          
          <div class="code">${code}</div>
          
          <p>请在5分钟内完成验证操作，如非本人操作请忽略此邮件。</p>
          
          <p>感谢您使用智慧微诊所系统！</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} 智慧微诊所系统 版权所有</p>
          <p>此为系统邮件，请勿直接回复</p>
        </div>
      </body>
      </html>
    `;
  }
}
