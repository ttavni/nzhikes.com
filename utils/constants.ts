export const transformRequest = (url: string) => {
  const hasQuery = url.indexOf("?") !== -1;
  const suffix = hasQuery
    ? "&pluginName=scrollytellingV2"
    : "?pluginName=scrollytellingV2";

  return {
    url: url + suffix,
  };
};
