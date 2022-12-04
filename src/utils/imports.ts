import * as ts from 'typescript';
import { getChildByHierarchy, getChildByType, getChildrenByType } from './ts-node-parser';

export function getImportFile(node) {
  if (node.kind === ts.SyntaxKind.ImportDeclaration) {
    const stringLiteral = getChildByType(node, ts.SyntaxKind.StringLiteral);
    if (stringLiteral) {
      return {
        fileName: stringLiteral.getFullText().trim().substr(1).slice(0, -1),
      };
    }
  }
  return { fileName: '' };
}
