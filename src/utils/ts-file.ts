import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import eventEmitter from '../utils/event-emitter';
import { MermaidMap } from '../interfaces/function-handler';
import { ExportNode, FunctionBlock, ImportNode, VariableNode } from '../interfaces/ts-building-blocks';
import { Options, TsOptions } from '../interfaces/Options';
import { getImportFile } from './imports';
import { getExportFunction } from './export-function';
import { getChildByType, getNodeTree } from './ts-node-parser';
import { getAllFunctionCalls } from './function-calls';
import { getAllMethods, getExportClasses } from './export-class';

export class TsFile {
  options: TsOptions;
  fileName: string;
  filePath: string;
  sourceFile: ts.SourceFile;
  imports: ImportNode[] = [];
  exports: ExportNode[] = [];
  variableDeclarations?: VariableNode[] = [];
  functionBlocks?: FunctionBlock[] = [];

  constructor(filePath: string, options) {
    this.options = options;
    this.filePath = path.resolve(filePath);
    this.fileName = path.basename(this.filePath, path.extname(this.filePath));
    this.sourceFile = ts.createSourceFile(
      this.fileName,
      fs.readFileSync(this.filePath).toString(),
      ts.ScriptTarget.ES5,
      true
    );
    this.parse();
  }

  async parse() {
    console.log('Parsing file:', this.filePath);
    await this.sourceFile.statements.map((node) => this.parseNode(node));
    eventEmitter.emit('tsFileParsed', this.imports);
  }

  parseNode(node) {
    this.parseForImports(node);
    this.parseForExports(node);

    node.getChildren().map((n) => this.parseNode(n));
  }

  parseForImports(node) {
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
  }

  parseForExports(node) {
    const exportFunction = getExportFunction(node);
    if (exportFunction) {
      // const nodeTree = getNodeTree(functionNode);
      this.exports.push({
        functionName: exportFunction.name,
        functionBlock: <FunctionBlock>{
          functionCalls: getAllFunctionCalls(exportFunction.functionNode),
        },
      });
    }
    const exportClass = getExportClasses(node);
    if (exportClass) {
      const methods = getAllMethods(exportClass.classNode);
      if (methods) {
        methods.forEach((md) => {
          this.exports.push({
            functionName: getChildByType(md, ts.SyntaxKind.Identifier).getFullText().trim(),
            functionBlock: {
              functionCalls: getAllFunctionCalls(md),
            },
          });
        });
      }
    }
  }

  serializeToGraphObject(): MermaidMap[] {
    console.log('Serializing file: ', this.filePath);
    return this.exports.map((fn) => {
      return {
        lhs: `${this.fileName}.${fn.functionName}`,
        rhs: fn.functionBlock.functionCalls,
      };
    });
  }
}
