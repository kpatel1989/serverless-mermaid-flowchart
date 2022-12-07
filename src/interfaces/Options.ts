import { EventEmitter } from 'events';

export interface Options {
  rootFolder: string;
  projectType: 'Serverless' | 'Stencil';
  entryFile: string;
  ignoreList: string[];
}

export interface TsOptions extends Options {
  eventEmitter: EventEmitter;
}
