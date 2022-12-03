import * as ts from 'typescript';
import * as fs from 'fs';
import { FunctionHandler } from '../interfaces/function-handler';

export const printNodeTree = async (fileName: string, filePath: string) => {
  const sourceFile = ts.createSourceFile(
    fileName,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.ES5,
    /*setParentNodes */ true
  );
  const tree = sourceFile.statements.map((node) => getNodeTree(node));
  fs.writeFileSync(`${__dirname}/tree.json`, JSON.stringify(tree));
};
export const parseTypeScriptFile = async (fileName: string, filePath: string, ignoreList): Promise<FunctionHandler[]> => {
  async function parseNode(node, allExports) {
    const { name, functionNode } = getExportFunction(node);
    if (name !== '' && functionNode != null) {
      const nodeTree = getNodeTree(functionNode);
      const handlers = await getAllfunctionCalls(functionNode, ignoreList);
      console.log(name, handlers);
      allExports.push({
        function: `${fileName}.${name}`,
        handler: handlers,
      });
    }
    await node.getChildren().map(async (n) => await parseNode(n, allExports));
  }

  const sourceFile = ts.createSourceFile(
    fileName,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.ES5,
    /*setParentNodes */ true
  );
  const allExports: FunctionHandler[] = [];
  await sourceFile.statements.map(async (node) => await parseNode(node, allExports));
  return allExports;
};

function getNodeTree(node) {
  return {
    kind: ts.SyntaxKind[node.kind],
    text: node.getFullText(),
    children: node.getChildren().map((n) => getNodeTree(n)),
  };
}

function getChildByType(node, type) {
  return node.getChildren().find((n) => n.kind == type);
}
function getChildrenByType(node, type) {
  return node.getChildren().filter((n) => n.kind == type);
}

function getChildByHierarchy(node, hierarchy, level = 0) {
  const foundNode = node.getChildren().find((n) => n.kind === hierarchy[level]);
  if (foundNode && level < hierarchy.length - 1) {
    return getChildByHierarchy(foundNode, hierarchy, level + 1);
  }
  return level == hierarchy.length - 1 ? foundNode : null;
}

async function getAllfunctionCalls(node, ignoreList) {
  const functionCalls = [];
  // Block.SyntaxList.ExpressionStatement[].AwaitExpression|CallExpression
  const syntaxList = getChildByHierarchy(node, [ts.SyntaxKind.Block, ts.SyntaxKind.SyntaxList]);
  if (syntaxList) {
    const expressionStatements = getChildrenByType(syntaxList, ts.SyntaxKind.ExpressionStatement);
    await expressionStatements.map((expressionStatement) => {
      let callExpression =
        getChildByHierarchy(expressionStatement, [ts.SyntaxKind.AwaitExpression, ts.SyntaxKind.CallExpression]) ||
        getChildByHierarchy(expressionStatement, [ts.SyntaxKind.CallExpression, ts.SyntaxKind.Identifier]) ||
        getChildByHierarchy(expressionStatement, [ts.SyntaxKind.CallExpression, ts.SyntaxKind.CallExpression]) ||
        getChildByHierarchy(expressionStatement, [ts.SyntaxKind.CallExpression]);
      if (callExpression) {
        const identifier =
          getChildByType(callExpression, ts.SyntaxKind.PropertyAccessExpression) ||
          getChildByType(callExpression, ts.SyntaxKind.Identifier);
        if (identifier) {
          const functionIdentifier = identifier.getFullText().trim();
          if (!ignoreList.includes(functionIdentifier)) {
            functionCalls.push(functionIdentifier);
          }
          // check for callback functions
          let callbackIdentifier = getChildByHierarchy(callExpression, [
            ts.SyntaxKind.SyntaxList,
            ts.SyntaxKind.PropertyAccessExpression,
          ]);
          if (callbackIdentifier) {
            functionCalls.push(callbackIdentifier.getFullText().trim());
          }
        }
      }
    });
  }
  return functionCalls;
}

function getExportFunction(node) {
  const fullText = node.getFullText().trim();
  if (node.kind === ts.SyntaxKind.BinaryExpression && fullText.startsWith('exports.')) {
    const arrowFunction = node.getChildren().find((n) => n.kind === ts.SyntaxKind.ArrowFunction);
    if (arrowFunction) {
      return {
        name: fullText.match(/^(exports.)\w+/g)[0].split('.')[1],
        functionNode: arrowFunction,
      };
    }
  }
  if (node.kind === ts.SyntaxKind.FirstStatement && fullText.startsWith('export ')) {
    const variableDeclarationList = node.getChildren().find((n) => n.kind === ts.SyntaxKind.VariableDeclarationList);
    if (variableDeclarationList) {
      const syntaxList = variableDeclarationList.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);
      if (syntaxList) {
        const variableDeclaration = syntaxList.getChildren().find((n) => n.kind === ts.SyntaxKind.VariableDeclaration);
        if (variableDeclaration) {
          const arrowFunction = variableDeclaration.getChildren().find((n) => n.kind === ts.SyntaxKind.ArrowFunction);
          if (arrowFunction) {
            return {
              name: variableDeclaration
                .getChildren()
                .find((n) => n.kind === ts.SyntaxKind.Identifier)
                .getFullText()
                .trim(),
              functionNode: arrowFunction,
            };
          }
          const functionExpression = variableDeclaration
            .getChildren()
            .find((n) => n.kind === ts.SyntaxKind.FunctionExpression);
          if (functionExpression) {
            return {
              name: variableDeclaration
                .getChildren()
                .find((n) => n.kind === ts.SyntaxKind.Identifier)
                .getFullText()
                .trim(),
              functionNode: functionExpression,
            };
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
    return {
      name: node
        .getChildren()
        .find((n) => n.kind === ts.SyntaxKind.Identifier)
        .getFullText()
        .trim(),
      functionNode: node,
    };
  }
  if (node.kind === ts.SyntaxKind.BinaryExpression && fullText.startsWith('module.exports')) {
    const arrowFunction = node.getChildren().find((n) => n.kind === ts.SyntaxKind.ArrowFunction);
    if (arrowFunction) {
      let identifier = node.getChildren().find((n) => n.kind === ts.SyntaxKind.Identifier);
      if (identifier) {
        return {
          name: identifier.getFullText().trim(),
          functionNode: arrowFunction,
        };
      }
      const funName = fullText.match(/^(module.exports.)\w+/g);
      if (funName) {
        return {
          name: funName[0].split('.')[2],
          functionNode: arrowFunction,
        };
      }
      return {
        name: 'Anonymous',
        functionNode: arrowFunction,
      };
    }
  }
  return {
    name: '',
    functionNode: null,
  };
}
