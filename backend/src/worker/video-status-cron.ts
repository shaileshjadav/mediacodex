import { updateVideoStatusCron } from "../api/services/cron.service";

/**
 * Start the cron job that runs every X minutes
 * @param intervalMinutes Interval in minutes (default: 5)
 */
export const startVideoStatusCron = (intervalMinutes: number = 5): NodeJS.Timeout => {
  console.log(
    `Starting video status cron job - runs every ${intervalMinutes} minute(s)`
  );

  // run at regular intervals
  const intervalMs = intervalMinutes * 60 * 1000;
  const interval = setInterval(() => {
    updateVideoStatusCron().catch(console.error);
  }, intervalMs);

  return interval;
};

/**
 * Stop the cron job
 */
export const stopVideoStatusCron = (interval: NodeJS.Timeout): void => {
  clearInterval(interval);
  console.log("Video status cron job stopped");
};
