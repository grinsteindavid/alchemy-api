const os = require('os');
const Logger = require('@simplyhexagonal/logger');
const { name } = require('./package.json');
const { setLogger } = require('./src/utils/logger');
const DiscordTransport = require('@simplyhexagonal/logger-transport-discord');
const { CLUSTER_REGION, CLUSTER_TYPE } = process.env;

const { LoggerTransportName } = Logger;

const consoleOptions = {
  transport: LoggerTransportName.CONSOLE,
  options: {
    destination: LoggerTransportName.CONSOLE,
    channelName: LoggerTransportName.CONSOLE,
  },
};

const discordOptions = {
  transport: LoggerTransportName.DISCORD,
  options: {
    channelName: 'api-errors',
    destination: process.env.DISCORD_WEBHOOK || '',
    rateLimit: 7000,
  },
};

const logger = new Logger({
  optionsByLevel: {
    debug: [consoleOptions],
    info: [consoleOptions],
    warn: [consoleOptions, discordOptions],
    error: [consoleOptions, discordOptions],
    fatal: [consoleOptions, discordOptions],
    all: [consoleOptions],
    raw: [consoleOptions],
  },
  transports: {
    [`${LoggerTransportName.DISCORD}`]: DiscordTransport,
  },
  appIdentifiers: {
    region: CLUSTER_REGION,
    clusterType: CLUSTER_TYPE,
    hostname: os.hostname(),
    app: name,
  },
  catchTransportErrors: true,
});

setLogger(logger);
global.logger = logger;
