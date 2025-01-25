const os = require('os');
const Logger = require('@simplyhexagonal/logger');
const { name } = require('./package.json');
const DiscordTransport = require('@simplyhexagonal/logger-transport-discord');
const MonoContext = require('@simplyhexagonal/mono-context');
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
    warn: process.env.DISCORD_WEBHOOK?.length > 0 ? [consoleOptions, discordOptions] : [consoleOptions],
    error: process.env.DISCORD_WEBHOOK?.length > 0 ? [consoleOptions, discordOptions] : [consoleOptions],
    fatal: process.env.DISCORD_WEBHOOK?.length > 0 ? [consoleOptions, discordOptions] : [consoleOptions],
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

MonoContext.setState({
  ['logger']: logger,
});
global.logger = logger;
