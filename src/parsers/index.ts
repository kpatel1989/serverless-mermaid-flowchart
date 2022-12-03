import * as path from 'path';
import { FunctionHandler } from '../interfaces/function-handler';
import { doesFileExists } from '../utils/file-exists';
import { parseServerlessYml } from './serverless-yml-parser';
import { parseTypeScriptFile, printNodeTree } from './typescript-parser';

export interface Options {
  rootFolder: string;
  projectType: 'Serverless' | 'Stencil';
  entryFile: string;
}

export const parseProject = async (
  options: Options
): Promise<FunctionHandler[] | null> => {
  console.log('Parsing Serverless.yml');
  const serverlessYmlPath = path.join(options.rootFolder, 'serverless.yml');

  const functionHandlerMap:FunctionHandler[] = parseServerlessYml(serverlessYmlPath);

  const handlerPath = options.entryFile;
  console.log('handler ', path.join(options.rootFolder, handlerPath));
  // if ((await doesFileExists(path.join(options.rootFolder, handlerPath)))!) {
  //   console.error('Handler file not found.');
  //   return null;
  // }
  const handlerFunctions = await parseTypeScriptFile(
    'handler',
    path.resolve(options.rootFolder, handlerPath)
  );
  // printNodeTree('handler',path.resolve(options.rootFolder, handlerPath));
  return functionHandlerMap.concat(handlerFunctions);
};
