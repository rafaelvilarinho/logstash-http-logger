# Logstash HTTP Logger

A simple logger with logstash integration using HTTP protocol.
### Logger Levels

- OFF: 0
- FATAL: 1
- ERROR: 2
- WARN: 3
- INFO: 4
- DEBUG: 5
- TRACE: 6
- ALL: 7

--
------

### Logger Level Visibility


| LEVEL |   FATAL   |   ERROR   |   WARN   |  INFO  |   DEBUG   |   TRACE   |
| :---: | :-------: | :-------: | :------: | -----: | :-------: | :-------: |
| OFF   |     x     |     x     |     x    |    x   |     x     |     x     |
| FATAL | &#x2611;  |     x     |     x    |    x   |     x     |     x     |
| ERROR | &#x2611;  | &#x2611;  |     x    |    x   |     x     |     x     |
| WARN  | &#x2611;  | &#x2611;  | &#x2611; |    x   |     x     |     x     |
| INFO  | &#x2611;  | &#x2611;  | &#x2611; |&#x2611;|     x     |     x     |
| DEBUG | &#x2611;  | &#x2611;  | &#x2611; |&#x2611;| &#x2611;  |     x     |
| TRACE | &#x2611;  | &#x2611;  | &#x2611; |&#x2611;| &#x2611;  | &#x2611;  |
| ALL   | &#x2611;  | &#x2611;  | &#x2611; |&#x2611;| &#x2611;  | &#x2611;  |

--
----
### Logger Configuration

```
{
  tags?: string[], // (optional)
  contextIdPropertyName?: string, // (optional) define your custom property name for context id
  defaultLayout?: Record<string, unknown> // (optional) define your custom log layout
}
```

--
---

### How to Use?

```
import LogstashHttpLogger from 'logstash-http-logger';

const config = {
  tags: ['logger-dev']
};

const Logger = new LogstashHttpLogger('url-logstash-with-port', 7, config); // Logger instance with ALL (7) level

Logger.info('Testing logger');
Logger.trace({ data: { test: true } });
Logger.error(new Error('Testing error'));

// Using Logger with a RequestId

Logger.setContextId('1234');

// These 3 statements will log with requestId = 1234
Logger.info('Testing logger with requestId');
Logger.trace({ data: { test: false } });
Logger.error(new Error('Testing error with requestId'));
```