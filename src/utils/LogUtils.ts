import { getParameter } from "@gatling.io/core";

export class LogUtils {
  private logLevel: string;

  constructor() {
    this.logLevel = getParameter("logLevel", "INFO").toUpperCase();
  }

  logInfo(message: string, additional?: any): void {
    if (this.isLoggable("INFO")) {
      if (additional !== undefined) {
        console.info(`INFO: ${message}`, additional);
      } else {
        console.info(`INFO: ${message}`);
      }
    }
  }

  logDebug(message: string, additional?: any): void {
    if (this.isLoggable("DEBUG")) {
      if (additional !== undefined) {
        console.debug(`DEBUG: ${message}`, additional);
      } else {
        console.debug(`DEBUG: ${message}`);
      }
    }
  }

  private isLoggable(level: string): boolean {
    const levels = ["DEBUG", "INFO"];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return currentLevelIndex >= messageLevelIndex;
  }
}
