import fs from "node:fs";
import path from "node:path";

/**
 * Saves error details to a daily log file.
 */
export const logErrorToFile = (
  method: string,
  url: string,
  status: number,
  message: string,
) => {
  try {
    const logsDir = path.join(process.cwd(), "logs");

    // Create the logs folder if it does not exist
    fs.mkdirSync(logsDir, { recursive: true });

    // File name for today's date (YYYY-MM-DD.log)
    const file = path.join(
      logsDir,
      `${new Date().toISOString().slice(0, 10)}.log`,
    );

    // Add error line to the file
    fs.appendFileSync(
      file,
      `[${new Date().toLocaleTimeString()}] ${status} ${method} ${url} - ${message}\n`,
    );
  } catch (err) {
    console.error("Log error failed:", err);
  }
};
