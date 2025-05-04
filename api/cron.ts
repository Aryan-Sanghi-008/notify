// api/cron.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkAndCreateReminderNotifications } from '../scripts/checkReminders';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await checkAndCreateReminderNotifications();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error running cron:", error);
    res.status(500).send("❌ Cron job failed");
  }
}
