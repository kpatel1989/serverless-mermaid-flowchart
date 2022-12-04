import * as ts from "typescript";
import { getChildByHierarchy, getChildByType, getChildrenByType } from "./ts-node-parser";

export function getExportFunction(node) {
    const fullText = node.getFullText().trim();
    if (node.kind === ts.SyntaxKind.BinaryExpression && fullText.startsWith('exports.')) {
      const functionDeclaration =
        getChildByHierarchy(node, [ts.SyntaxKind.ArrowFunction]) ||
        getChildByHierarchy(node, [ts.SyntaxKind.FunctionExpression]);
      const propertyAccessExpression = getChildByType(node, ts.SyntaxKind.PropertyAccessExpression);
      if (functionDeclaration && propertyAccessExpression.getChildren().length === 3) {
        return {
          name: propertyAccessExpression.getChildren()[2].getFullText().trim(),
          functionNode: functionDeclaration,
        };
      }
    }
    if (node.kind === ts.SyntaxKind.FirstStatement && fullText.startsWith('export ')) {
      const variableDeclaration = getChildByHierarchy(node, [
        ts.SyntaxKind.VariableDeclarationList,
        ts.SyntaxKind.SyntaxList,
        ts.SyntaxKind.VariableDeclaration,
      ]);
      if (variableDeclaration) {
        const functionExp =
          getChildByType(variableDeclaration, ts.SyntaxKind.ArrowFunction) ||
          getChildByType(variableDeclaration, ts.SyntaxKind.FunctionExpression);
        if (functionExp) {
          const identifier = getChildByType(variableDeclaration, ts.SyntaxKind.Identifier);
          return {
            name: identifier.getFullText().trim(),
            functionNode: functionExp,
          };
        }
      }
    }
    if (node.kind === ts.SyntaxKind.FunctionDeclaration && fullText.startsWith('export ')) {
      return {
        name: getChildByType(node, ts.SyntaxKind.Identifier).getFullText().trim(),
        functionNode: node,
      };
    }
    if (node.kind === ts.SyntaxKind.BinaryExpression && fullText.startsWith('module.exports')) {
      const arrowFunction = getChildByType(node, ts.SyntaxKind.ArrowFunction);
      if (arrowFunction) {
        let identifier = getChildByType(node, ts.SyntaxKind.Identifier);
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