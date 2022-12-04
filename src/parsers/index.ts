import * as path from 'path';
import { Options } from '../interfaces/Options';
import { MermaidMap } from '../interfaces/function-handler';
import { parseServerlessYml } from './serverless-yml-parser';
import { TsFile } from './typescript-file-parser';

export const parseProject = (options: Options): MermaidMap[] | null => {
  console.log('Parsing Serverless.yml');
  const serverlessYmlPath = path.join(options.rootFolder, 'serverless.yml');

  const functionHandlerMap: MermaidMap[] = parseServerlessYml(serverlessYmlPath);

  const tsFile = new TsFile('handler', path.resolve(options.rootFolder, options.entryFile), options);
  const handlerFunctions = tsFile.parse();

  console.log(handlerFunctions);
  return functionHandlerMap.concat(handlerFunctions);
};
