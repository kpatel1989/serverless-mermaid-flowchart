import * as ts from "typescript";
import { getAllFunctionCalls } from "./function-calls";
import { getChildByHierarchy, getChildByType, getChildrenByRecursiveHierarchy } from "./ts-node-parser";

export function getExportClasses(node) {
    if (node.kind === ts.SyntaxKind.ClassDeclaration
        && getChildByHierarchy(node, [ts.SyntaxKind.SyntaxList, ts.SyntaxKind.ExportKeyword])) {
        const identifier = getChildByType(node, ts.SyntaxKind.Identifier);
        return{
            name: identifier.getFullText().trim(),
            classNode: node
        }
    }
    return null;
}

export function getAllMethods(node) {
    const methodDeclarations = getChildrenByRecursiveHierarchy(node, [ts.SyntaxKind.SyntaxList, ts.SyntaxKind.MethodDeclaration])
    console.log(methodDeclarations);
    return methodDeclarations;
}