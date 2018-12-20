let config = {
  action: 'https://upload_url'
}

function getConfig(): any {
  return config;
};

function setConfig(props: any) {
  const newConfig = {
    ...config,
    ...props
  };
  config = newConfig;
};

export {
  getConfig,
  setConfig
}
