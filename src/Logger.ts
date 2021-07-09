import fetch from 'isomorphic-fetch';
import { ILoggerConfiguration } from './ILoggerConfiguration';
import LoggerLevelEnum from './LoggerLevelEnum';

export default class Logger {
  private _requestId: string

  constructor (
    private logstashUrl: string,
    private level: number = LoggerLevelEnum.INFO,
    private configuration?: ILoggerConfiguration,
  ) {
    this._requestId = ''
  }

  private allowLog (level: LoggerLevelEnum): boolean {
    return level <= this.level
  }

  public fatal(message: string, content: Record<string, unknown>): void {
    this.allowLog(LoggerLevelEnum.FATAL) && this.log('fatal', message, content)
  }

  public error(message: string, content: Record<string, unknown>): void {
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

  public trace(content: Record<string, unknown>): void {
    this.allowLog(LoggerLevelEnum.TRACE) && this.log('trace', '', content)
  }

  public setContextId (id: string): void {
    this._requestId = id
  }

  private log(level: string, message: string, content?: Record<string, unknown>): void {
    try {
      const bodyContent = this.configuration?.defaultLayout ? {
        ...this.configuration.defaultLayout,
        ...content
      } : { ...content }

      fetch(this.logstashUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          '@tags': this.configuration?.tags || [],
          [this.configuration?.contextIdPropertyName || 'contextId']: this._requestId,
          'log.level': level,
          message,
          ...bodyContent
        }),
      }).catch(console.log);
    } catch (error) {
      console.log('LogstashHttpLogger', error)
    }
  };
}