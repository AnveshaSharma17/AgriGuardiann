// Centralized logging utility
// Replaces console.error with structured logging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // In development, log to console with formatting
    if (this.isDevelopment) {
      const style = this.getLogStyle(level);
      console.log(`%c[${level.toUpperCase()}]%c ${message}`, style, '');
      if (context) {
        console.log('Context:', context);
      }
      if (error) {
        console.error('Error:', error);
      }
    } else {
      // In production, you could send to a logging service
      // For now, we'll still log to console but in a structured way
      console.log(JSON.stringify(entry));
    }
  }

  private getLogStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #666; font-weight: bold',
      info: 'color: #2196F3; font-weight: bold',
      warn: 'color: #FF9800; font-weight: bold',
      error: 'color: #F44336; font-weight: bold',
    };
    return styles[level];
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, context, error);
  }
}

// Export singleton instance
export const logger = new Logger();
