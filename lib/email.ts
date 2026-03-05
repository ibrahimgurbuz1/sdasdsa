import nodemailer from 'nodemailer';
import { queueEmail } from './emailQueue';

interface AppointmentEmailData {
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  serviceName: string;
  staffName: string;
}

export async function sendAppointmentConfirmationEmail(data: AppointmentEmailData) {
  const { customerName, customerEmail, date, time, serviceName, staffName } = data;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Demir Güzellik Merkezi'}" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: '✅ Randevunuz Onaylandı - Demir Güzellik Merkezi',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #C5A059, #ad8345);
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
          }
          .appointment-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #C5A059;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: bold;
            color: #666;
            width: 120px;
          }
          .detail-value {
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          .contact {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin-top: 20px;
          }
          .contact a {
            color: #C5A059;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Demir Güzellik Merkezi</h1>
        </div>
        <div class="content">
          <p class="greeting">Sayın ${customerName},</p>
          <p>Randevunuz <strong>onaylanmıştır</strong>. Aşağıda randevu detaylarınızı bulabilirsiniz:</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">📅 Tarih:</span>
              <span class="detail-value">${date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Saat:</span>
              <span class="detail-value">${time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">💇 Hizmet:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👤 Uzman:</span>
              <span class="detail-value">${staffName}</span>
            </div>
          </div>

          <p>Randevunuzdan <strong>10 dakika önce</strong> salonumuza gelmenizi rica ederiz.</p>
          <p>Herhangi bir değişiklik veya iptal için bizimle iletişime geçebilirsiniz.</p>

          <div class="contact">
            <p>📞 <a href="tel:03121234567">0312 123 45 67</a></p>
            <p>📧 <a href="mailto:info@demirguzelllik.com">info@demirguzelllik.com</a></p>
          </div>

          <div class="footer">
            <p>Bizi tercih ettiğiniz için teşekkür ederiz!</p>
            <p>Demir Güzellik Merkezi</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    // Queue email for async sending (non-blocking)
    const jobId = await queueEmail(mailOptions.to, mailOptions.subject, mailOptions.html);
    console.log(`Onay e-postası kuyruğa eklendi: ${customerEmail} (JobID: ${jobId})`);
    return { success: true, jobId };
  } catch (error) {
    console.error('E-posta kuyruklandırma hatası:', error);
    return { success: false, error };
  }
}

export async function sendAppointmentReceivedEmail(data: AppointmentEmailData) {
  const { customerName, customerEmail, date, time, serviceName, staffName } = data;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Demir Güzellik Merkezi'}" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: '📋 Randevunuz İşleme Alındı - Demir Güzellik Merkezi',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #C5A059, #ad8345);
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: rgba(255,255,255,0.9);
            margin: 5px 0 0;
            font-size: 14px;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
          }
          .status-badge {
            display: inline-block;
            background: #FEF3C7;
            color: #92400E;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .appointment-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #C5A059;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: bold;
            color: #666;
            width: 120px;
          }
          .detail-value {
            color: #333;
          }
          .info-box {
            background: #EFF6FF;
            border: 1px solid #BFDBFE;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            color: #1E40AF;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          .contact {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin-top: 20px;
          }
          .contact a {
            color: #C5A059;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Demir Güzellik Merkezi</h1>
          <p>GÜZELLİK MERKEZİ</p>
        </div>
        <div class="content">
          <p class="greeting">Sayın ${customerName},</p>
          <span class="status-badge">⏳ İşleme Alındı</span>
          <p>Randevunuz başarıyla <strong>işleme alınmıştır</strong>. En kısa sürede onay e-postası tarafınıza gönderilecektir.</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">📅 Tarih:</span>
              <span class="detail-value">${date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Saat:</span>
              <span class="detail-value">${time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">💇 Hizmet:</span>
              <span class="detail-value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👤 Uzman:</span>
              <span class="detail-value">${staffName}</span>
            </div>
          </div>

          <div class="info-box">
            ℹ️ Randevunuz onaylandığında size ayrı bir onay e-postası gönderilecektir. Lütfen onay e-postasını bekleyiniz.
          </div>

          <p>Herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.</p>

          <div class="contact">
            <p>📞 <a href="tel:03121234567">0312 123 45 67</a></p>
            <p>📧 <a href="mailto:info@demirguzelllik.com">info@demirguzelllik.com</a></p>
          </div>

          <div class="footer">
            <p>Bizi tercih ettiğiniz için teşekkür ederiz!</p>
            <p>Demir Güzellik Merkezi</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    // Queue email for async sending (non-blocking)
    const jobId = await queueEmail(mailOptions.to, mailOptions.subject, mailOptions.html);
    console.log(`İşleme alındı e-postası kuyruğa eklendi: ${customerEmail} (JobID: ${jobId})`);
    return { success: true, jobId };
  } catch (error) {
    console.error('E-posta kuyruklandırma hatası:', error);
    return { success: false, error };
  }
}
