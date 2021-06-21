import fetch from 'isomorphic-fetch';
import LoggerLevelEnum from './LoggerLevelEnum';

export default class Logger {
  constructor (
    private logstashUrl: string,
    private level: number = LoggerLevelEnum.INFO,
    private tags?: string[],
  ) {

  }

  private allowLog (level: LoggerLevelEnum): boolean {
    return level <= this.level
  }

  public fatal(message: string, content: unknown): void {
    this.allowLog(LoggerLevelEnum.FATAL) && this.log('fatal', message, content)
  }

  public error(message: string, content: unknown): void {
    this.allowLog(LoggerLevelEnum.ERROR) && this.log('error', message, content)
  }

  public warn(message: string): void {
    this.allowLog(LoggerLevelEnum.WARN) && this.log('warn', message)
  }

  public info(message: string): void {
    this.allowLog(LoggerLevelEnum.INFO) && this.log('info', message)
  }

  public debug(message: string): void {
    this.allowLog(LoggerLevelEnum.DEBUG) && this.log('debug', message)
  }

  public trace(content: unknown): void {
    this.allowLog(LoggerLevelEnum.TRACE) && this.log('trace', '', content)
  }

  private log(level: string, message: string, content?: unknown): void {
    try {
      fetch(this.logstashUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: content,
          '@tags': this.tags || [],
          'log.level': level,
          message
        }),
      }).catch(console.log);
    } catch (error) {
      console.log('LogstashHttpLogger', error)
    }
  };
}