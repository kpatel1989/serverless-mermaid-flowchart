import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { MermaidMap } from '../interfaces/function-handler';
import { printAllChildren } from '../utils/ts-node-parser';
import { Options } from '../interfaces/Options';
import { ExportNode, ImportNode } from '../interfaces/ts-building-blocks';
import { getImportFile } from '../utils/imports';
import { TsFile } from '../utils/ts-file';
import eventEmitter from '../utils/event-emitter';

export const printNodeTree = (fileName: string, filePath: string) => {
  const sourceFile = ts.createSourceFile(
    fileName,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.ES5,
    /*setParentNodes */ true
  );
  const tree = sourceFile.statements.map((node) => printAllChildren(node)).join('\n');
  return tree;
};

export class TsParser {
  options: Options;
  tsFiles: { [key: string]: TsFile } = {};


  exports: ExportNode[];
  imports: ImportNode[];

  totalFileCount = 0;
  totalEventCount = 0;

  constructor(options) {
    this.options = options;
    eventEmitter.on('tsFileParsed', this.onTsFileParsed.bind(this));
    const filePath = path.resolve(options.rootFolder, options.entryFile);
    this.addFile(filePath);
  }

  addFile(filePath) {
    if (!this.tsFiles[filePath]) {
      this.totalFileCount++;
      console.log('FileCount:', this.totalFileCount);
      console.log('Adding file:', filePath);
      this.tsFiles[filePath] = new TsFile(filePath, this.options);
      return true;
    }
    return false;
  }

  onTsFileParsed(importedFiles) {
    console.log('Event Listener :', importedFiles);
    this.totalEventCount++;
    console.log('Event count:', this.totalEventCount);
    const isMoreFilesAdded = importedFiles.reduce(((newFile, importNode: ImportNode) => {
      console.log('New File', importNode.filePath);
      return false || this.addFile(importNode.filePath);
    }).bind(this), false);
    if (!isMoreFilesAdded && this.totalEventCount === this.totalFileCount) {
      console.log("=========== All Done ==========");
      eventEmitter.emit('allFilesParsed', true);
    }
  }

  public serializeToGraphObject(): MermaidMap[] {
    return Object.keys(this.tsFiles).reduce((map, filePath) => {
      return map.concat(this.tsFiles[filePath].serializeToGraphObject());
    }, []);
  }
}
