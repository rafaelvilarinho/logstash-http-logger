export interface ILoggerConfiguration {
  tags?: string[];
  contextIdPropertyName?: string;
  defaultLayout?: Record<string, unknown>;
}