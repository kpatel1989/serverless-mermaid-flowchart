import { MermaidMap } from "../interfaces/function-handler";

const { Config } = require('sls-config-parser');

export const parseServerlessYml = (filePath: string): MermaidMap[] => {
  const customCfg = new Config({
    stage: 'prod',
    _path: filePath,
  });
  const configs = customCfg.config();
  return Object.keys(configs.functions).map((fun) => {
    
    return {
      lhs: fun,
      rhs: [configs.functions[fun].handler],
    };
  });
};
