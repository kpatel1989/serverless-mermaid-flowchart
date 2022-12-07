import * as fs from 'fs';
import * as ts from 'typescript';

export const doesFileExists = async (filePath: string) => {
  return await fs.existsSync(filePath);
};

export function getNodeTree(node) {
  return {
    kind: ts.SyntaxKind[node.kind],
    text: node.getFullText(),
    children: node.getChildren().map((n) => getNodeTree(n)),
  };
}

export function printAllChildren(node: ts.Node, depth = 0) {
  let text = node
    .getFullText()
    .trim()
    .replace(/(\r\n|\r|\n| )/g, '');
  text = text.slice(0, 20);
  let tree = `${new Array(depth + 1).join('----')}${ts.SyntaxKind[node.kind]} => ${text}`;
  depth++;
  tree +=
    node.getChildren().length > 0
      ? '\n' +
        node
          .getChildren()
          .map((c) => printAllChildren(c, depth))
          .join('\n')
      : '';
  return tree;
}

export function getChildByType(node, type) {
  return node.getChildren().find((n) => n.kind == type);
}
export function getChildrenByType(node, type) {
  return node.getChildren().filter((n) => n.kind == type);
}

export function getChildByHierarchy(node, hierarchy, level = 0) {
  const foundNode = node.getChildren().find((n) => n.kind === hierarchy[level]);
  if (foundNode && level < hierarchy.length - 1) {
    return getChildByHierarchy(foundNode, hierarchy, level + 1);
  }
  return level == hierarchy.length - 1 ? foundNode : null;
}

export function getChildrenByRecursiveHierarchy(node, hierarchy, level = 0) {
  const filteredNodes = node.getChildren().filter((n) => n.kind === hierarchy[level]);
  if (filteredNodes.length > 0 && level < hierarchy.length - 1) {
    for (let i = 0; i < filteredNodes.length; i++) {
      const foundChild = getChildrenByRecursiveHierarchy(filteredNodes[i], hierarchy, level + 1);
      if (foundChild && foundChild.length>0) {
        return foundChild;
      }
    }
  }
  return level == hierarchy.length - 1 ? filteredNodes : null;
}
