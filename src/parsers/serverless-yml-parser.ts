import { FunctionHandler } from "../interfaces/function-handler";

const { Config } = require('sls-config-parser');

export const parseServerlessYml = (filePath: string): FunctionHandler[] => {
  const customCfg = new Config({
    stage: 'prod',
    _path: filePath,
  });
  const configs = customCfg.config();
  return Object.keys(configs.functions).map((fun) => {
    
    return {
      function: fun,
      handler: [configs.functions[fun].handler],
    };
  });
};
