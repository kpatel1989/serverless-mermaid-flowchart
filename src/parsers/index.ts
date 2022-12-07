import * as path from 'path';
import { Options } from '../interfaces/Options';
import { MermaidMap } from '../interfaces/function-handler';
import { parseServerlessYml } from './serverless-yml-parser';
import { TsParser } from './typescript-file-parser';
import eventEmitter from '../utils/event-emitter';

export const parseProject = (options: Options): Promise<MermaidMap[] | null> => {
  console.log('Parsing Serverless.yml');
  const serverlessYmlPath = path.join(options.rootFolder, 'serverless.yml');

  const functionHandlerMap: MermaidMap[] = parseServerlessYml(serverlessYmlPath);

  const tsParser = new TsParser(options);
  const promise: Promise<MermaidMap[] | null> = new Promise((resolve, reject) => {
    eventEmitter.on('allFilesParsed', () => {
      try {
        const handlerFunctions = tsParser.serializeToGraphObject();
        console.log(handlerFunctions);
        resolve(functionHandlerMap.concat(handlerFunctions));
      } catch (err) {
        console.log('Error serializing object', err);
        reject(null);
      }
    });
    eventEmitter.on('errorOnParsingTsFiles', (err) => {
      console.log('Error on parsing ts files', err);
      reject(null);
    });
  });
  return promise;
};
