/**
 * Email Queue System
 * Async, non-blocking email sending with retry logic
 */

import nodemailer from 'nodemailer';

interface EmailJob {
  id: string;
  to: string;
  subject: string;
  html: string;
  retries: number;
  createdAt: number;
  status: 'pending' | 'sent' | 'failed';
}

const emailQueue: Map<string, EmailJob> = new Map();
let isProcessing = false;

// Hostinger SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Add email to queue for background sending
 */
export async function queueEmail(
  to: string,
  subject: string,
  html: string
): Promise<string> {
  const jobId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const job: EmailJob = {
    id: jobId,
    to,
    subject,
    html,
    retries: 0,
    createdAt: Date.now(),
    status: 'pending',
  };

  emailQueue.set(jobId, job);

  // Start processing in background (non-blocking)
  setImmediate(() => processEmailQueue());

  return jobId;
}

/**
 * Process email queue
 */
async function processEmailQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    for (const [jobId, job] of emailQueue.entries()) {
      if (job.status !== 'pending') continue;

      try {
        // Send email with timeout
        await sendEmailWithTimeout(job);
        job.status = 'sent';
        emailQueue.set(jobId, job);
      } catch (error) {
        console.error(`Email send error for ${jobId}:`, error);

        // Retry logic (max 3 attempts)
        if (job.retries < 3) {
          job.retries++;
          // Exponential backoff
          await delay(Math.pow(2, job.retries) * 1000);
        } else {
          job.status = 'failed';
          console.error(`Email ${jobId} failed after 3 retries`);
        }
        emailQueue.set(jobId, job);
      }
    }
  } finally {
    isProcessing = false;
  }
}

/**
 * Send email with timeout
 */
async function sendEmailWithTimeout(
  job: EmailJob,
  timeoutMs: number = 10000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Email send timeout'));
    }, timeoutMs);

    transporter.sendMail(
      {
        from: `"${process.env.SMTP_FROM_NAME || 'Demir Güzellik Merkezi'}" <${process.env.SMTP_USER}>`,
        to: job.to,
        subject: job.subject,
        html: job.html,
      },
      (error) => {
        clearTimeout(timeout);
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

/**
 * Helper function for delays
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get email queue status
 */
export function getQueueStatus() {
  const stats = {
    total: emailQueue.size,
    pending: 0,
    sent: 0,
    failed: 0,
  };

  emailQueue.forEach((job) => {
    stats[job.status]++;
  });

  return stats;
}

/**
 * Verify transporter connection
 */
export async function verifyTransporter(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Transporter verification failed:', error);
    return false;
  }
}

export default transporter;
