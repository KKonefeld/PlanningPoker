type Environment = keyof typeof configs;

export const environment: Environment = "local";

const defaultConfig = {
  currentAppVersion: 1,
};

const configs = {
  local: {
    ...defaultConfig,
    baseUrl: "http://192.168.1.24:3071",
    websocketUrl: "http://192.168.1.24:3071",
    sentryDsn: "",
    googleApiKey: "",
  },
  production: {
    ...defaultConfig,
    baseUrl: "",
    websocketUrl: "",
    sentryDsn: "",
    googleApiKey: "",
  },
};
export const config = configs[environment];
