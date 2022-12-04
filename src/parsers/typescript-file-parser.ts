import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { MermaidMap } from '../interfaces/function-handler';
import { getNodeTree, printAllChildren } from '../utils/ts-node-parser';
import { Options } from '../interfaces/Options';
import { getAllFunctionCalls } from '../utils/function-calls';
import { getExportFunction } from '../utils/export-function';
import { ExportNode, FunctionBlock, ImportNode } from '../interfaces/ts-building-blocks';
import { getImportFile } from '../utils/imports';

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
export class TsFile {
  fileName: string;
  filePath: string;
  options: Options;
  sourceFile: ts.SourceFile;

  exports: ExportNode[];
  imports: ImportNode[];

  constructor(fileName, filePath, options) {
    this.fileName = fileName;
    this.filePath = filePath;
    this.options = options;
    this.sourceFile = ts.createSourceFile(
      this.fileName,
      fs.readFileSync(this.filePath).toString(),
      ts.ScriptTarget.ES5,
      true
    );
  }

  parseNode(node) {
    const { name, functionNode } = getExportFunction(node);
    if (name !== '' && functionNode != null) {
      const nodeTree = getNodeTree(functionNode);
      const handlers = getAllFunctionCalls(functionNode);
      this.exports.push({
        functionName: name,
        functionBlock: <FunctionBlock>{
          functionCalls: handlers,
        },
      });
    }
    const { fileName } = getImportFile(node);
    if (fileName && fileName != '') {
      let filePath = path.resolve(path.dirname(this.filePath), fileName);
      filePath = fileName.endsWith('.ts') ? filePath : filePath + '.ts';
      if (fs.existsSync(filePath)) {
        this.imports.push({
          filePath,
        });
      }
    }
    node.getChildren().map((n) => this.parseNode(n));
  }

  public parse(): MermaidMap[] {
    this.exports = [];
    this.imports = [];
    this.sourceFile.statements.map((node) => this.parseNode(node));
    console.log(this.imports);
    return this.exports.map((fn) => {
      return {
        lhs: `${this.fileName}.${fn.functionName}`,
        rhs: fn.functionBlock.functionCalls,
      };
    });
  }
}
