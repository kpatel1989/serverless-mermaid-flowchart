import * as ts from 'typescript';
import * as fs from 'fs';
import { FunctionHandler } from '../interfaces/function-handler';

export const parseTypeScriptFile = async (fileName: string, filePath: string): Promise<FunctionHandler[]> => {
  async function parseNode(node, allExports) {
    const name = getExportFunction(node);
    if (name !== '') {
      allExports.push({
        function: `${fileName}.${name}`,
        handler: ['End']
      });
    }
    await node.getChildren().map(async (n) => await parseNode(n, allExports));
  }
  async function createObj(node) {
    const name = getExportFunction(node);
    return {
      text: node.getFullText().trim(),
      name: `${fileName}.${name}`,
    };
  }

  function getExportFunction(node) {
    const fullText = node.getFullText().trim();
    if (
      node.kind === ts.SyntaxKind.BinaryExpression &&
      fullText.startsWith('exports.') &&
      node.getChildren().find((n) => n.kind === ts.SyntaxKind.ArrowFunction)
    ) {
      return fullText.match(/^(exports.)\w+/g)[0].split('.')[1];
    }
    if (node.kind === ts.SyntaxKind.FirstStatement && fullText.startsWith('export ')) {
      const variableDeclarationList = node.getChildren().find((n) => n.kind === ts.SyntaxKind.VariableDeclarationList);
      if (variableDeclarationList) {
        const syntaxList = variableDeclarationList.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);
        if (syntaxList) {
          const variableDeclaration = syntaxList
            .getChildren()
            .find((n) => n.kind === ts.SyntaxKind.VariableDeclaration);
          if (variableDeclaration) {
            const arrowFunction = variableDeclaration.getChildren().find((n) => n.kind === ts.SyntaxKind.ArrowFunction);
            if (arrowFunction) {
              return variableDeclaration
                .getChildren()
                .find((n) => n.kind === ts.SyntaxKind.Identifier)
                .getFullText()
                .trim();
            }
            const functionExpression = variableDeclaration
              .getChildren()
              .find((n) => n.kind === ts.SyntaxKind.FunctionExpression);
            if (functionExpression) {
              return variableDeclaration
                .getChildren()
                .find((n) => n.kind === ts.SyntaxKind.Identifier)
                .getFullText()
                .trim();
            }
          }
        } else {
          console.log('Syntax List missing in Variable Declaration', variableDeclarationList.getFullText());
        }
      } else {
        console.log(
          'Variable Declaration List missing as sibling of Syntax List inside First Statement',
          node.parent.parent.getFullText()
        );
      }
    }
    if (node.kind === ts.SyntaxKind.FunctionDeclaration && fullText.startsWith('export ')) {
      return node
        .getChildren()
        .find((n) => n.kind === ts.SyntaxKind.Identifier)
        .getFullText()
        .trim();
    }
    if (node.kind === ts.SyntaxKind.BinaryExpression && fullText.startsWith('module.exports')) {
      if (node.getChildren().find((n) => n.kind === ts.SyntaxKind.ArrowFunction)) {
        let identifier = node.getChildren().find((n) => n.kind === ts.SyntaxKind.Identifier);
        if (identifier) {
          return identifier.getFullText().trim();
        }
        const funName = fullText.match(/^(module.exports.)\w+/g);
        if (funName) {
          return funName[0].split('.')[2];
        }
        return 'Anonymous';
      }
    }
    return '';
  }

  const sourceFile = ts.createSourceFile(
    fileName,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.ES5,
    /*setParentNodes */ true
  );
  const allExports:FunctionHandler[] = [];
  await sourceFile.statements.map(async (node) => await parseNode(node, allExports));
  return allExports;
};
