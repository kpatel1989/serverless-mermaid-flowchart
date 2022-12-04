import * as ts from "typescript";
import { getChildByHierarchy, getChildByType, getChildrenByType } from "./ts-node-parser";

export function getAllFunctionCalls(node) {
    const functionCalls = [];
    const syntaxList = getChildByHierarchy(node, [ts.SyntaxKind.Block, ts.SyntaxKind.SyntaxList]);
    if (syntaxList) {
      const expressionStatements = getChildrenByType(syntaxList, ts.SyntaxKind.ExpressionStatement);
      expressionStatements.map((expressionStatement) => {
        let callExpression =
          getChildByHierarchy(expressionStatement, [ts.SyntaxKind.AwaitExpression, ts.SyntaxKind.CallExpression]) ||
          getChildByHierarchy(expressionStatement, [ts.SyntaxKind.CallExpression, ts.SyntaxKind.CallExpression]) ||
          getChildByHierarchy(expressionStatement, [ts.SyntaxKind.CallExpression]);
        if (callExpression) {
          const identifier =
            getChildByType(callExpression, ts.SyntaxKind.PropertyAccessExpression) ||
            getChildByType(callExpression, ts.SyntaxKind.Identifier);
          if (identifier) {
            const functionIdentifier = identifier.getFullText().trim();
            functionCalls.push(functionIdentifier);
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