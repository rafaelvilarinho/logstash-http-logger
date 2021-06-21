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

  public info(message: string): void {
    this.allowLog(LoggerLevelEnum.INFO) && this.log('info', message)
  }

  public warn(message: string, ...contents: unknown[]): void {
    this.allowLog(LoggerLevelEnum.WARN) && this.log('warn', message, contents)
  }

  public error(message: string, ...contents: unknown[]): void {
    this.allowLog(LoggerLevelEnum.ERROR) && this.log('error', message, contents)
  }

  public fatal(message: string, ...contents: unknown[]): void {
    this.allowLog(LoggerLevelEnum.FATAL) && this.log('fatal', message, contents)
  }

  public debug(message: string, ...contents: unknown[]): void {
    this.allowLog(LoggerLevelEnum.DEBUG) && this.log('debug', message, contents)
  }

  public trace(message: string, ...contents: unknown[]): void {
    this.allowLog(LoggerLevelEnum.TRACE) && this.log('trace', message, contents)
  }

  private log(level: string, message: string, ...contents: unknown[]): void {
    try {
      fetch(this.logstashUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: contents,
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