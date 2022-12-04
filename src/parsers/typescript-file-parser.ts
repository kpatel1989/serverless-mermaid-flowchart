import * as ts from 'typescript';
import * as fs from 'fs';
import { MermaidMap } from '../interfaces/function-handler';
import {
  getChildByHierarchy,
  getChildByType,
  getChildrenByType,
  getNodeTree,
  printAllChildren,
} from '../utils/ts-node-parser';
import { Options } from '../interfaces/Options';
import { getAllFunctionCalls } from '../utils/function-calls';
import { getExportFunction } from '../utils/export-function';

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

  parseNode(node, allExports) {
    const { name, functionNode } = getExportFunction(node);
    if (name !== '' && functionNode != null) {
      const nodeTree = getNodeTree(functionNode);
      const handlers = getAllFunctionCalls(functionNode);
      allExports.push({
        lhs: `${this.fileName}.${name}`,
        rhs: handlers,
      });
    }
    node.getChildren().map((n) => this.parseNode(n, allExports));
  }

  public parse(): MermaidMap[] {
    const allExports: MermaidMap[] = [];

    this.sourceFile.statements.map((node) => this.parseNode(node, allExports));
    return allExports;
  }
}
