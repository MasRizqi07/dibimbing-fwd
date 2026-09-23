const required = ["ADMIN_TOTP_SECRET", "CRON_SECRET", "PROJECT_MEDIA_BUCKET", "PROJECT_MEDIA_REGION"];
const missing = required.filter((name) => !process.env[name]);
const errors = [];

if (!process.env.CLAMAV_SOCKET_PATH && !process.env.CLAMAV_HOST) missing.push("CLAMAV_SOCKET_PATH or CLAMAV_HOST");
if (process.env.PROJECT_MEDIA_ENDPOINT && (!process.env.PROJECT_MEDIA_ACCESS_KEY_ID || !process.env.PROJECT_MEDIA_SECRET_ACCESS_KEY)) {
  errors.push("PROJECT_MEDIA_ENDPOINT requires PROJECT_MEDIA_ACCESS_KEY_ID and PROJECT_MEDIA_SECRET_ACCESS_KEY.");
}
if ((process.env.NOTIFICATION_WEBHOOK_URL && !process.env.NOTIFICATION_WEBHOOK_SECRET) || (!process.env.NOTIFICATION_WEBHOOK_URL && process.env.NOTIFICATION_WEBHOOK_SECRET)) {
  errors.push("NOTIFICATION_WEBHOOK_URL and NOTIFICATION_WEBHOOK_SECRET must be configured together.");
}
if (process.env.NOTIFICATION_WEBHOOK_KIND && !["generic", "slack", "discord"].includes(process.env.NOTIFICATION_WEBHOOK_KIND)) {
  errors.push("NOTIFICATION_WEBHOOK_KIND must be generic, slack, or discord.");
}
if (process.env.ADMIN_TOTP_SECRET && !/^[A-Z2-7]{16,}$/i.test(process.env.ADMIN_TOTP_SECRET.replace(/\s+/g, ""))) {
  errors.push("ADMIN_TOTP_SECRET must be an unpadded Base32 value with at least 16 characters.");
}
if (process.env.NOTIFICATION_WEBHOOK_URL) {
  try {
    if (new URL(process.env.NOTIFICATION_WEBHOOK_URL).protocol !== "https:") errors.push("NOTIFICATION_WEBHOOK_URL must use HTTPS.");
  } catch {
    errors.push("NOTIFICATION_WEBHOOK_URL must be a valid URL.");
  }
}
if (missing.length) errors.push(`Missing: ${missing.join(", ")}.`);

if (errors.length) {
  console.error("Phase 2 configuration is incomplete:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Phase 2 configuration is structurally valid. Secret values were not printed.");
}
