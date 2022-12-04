// Function Call
// Await
// Object creation
// Classes and its methods
// Array
// Callbacks
// Imports
// Comments
// Variable Scope and closures

/*
    imports
    exports
    -- variables / object creation
    -- functions calls
    ---- arguments
    ---- variables / object creation
    ---- function declarations
    ------ variables
    ------ function calls
    -------- arguments
    variables

    function declarations
    -- variables
    -- function calls
    ---- arguments

    functions calls
    ---- arguments
  */

export interface VariableNode {}
export interface ImportNode {
  filePath: string;
  variables?: VariableNode[]
}

export interface ExportNode {
  functionName: string;
  functionBlock: FunctionBlock;
}

export interface FunctionCall {
  variables: VariableNode[];
  functionCall: FunctionCall[];
}

export interface FunctionBlock {
  variableDeclarations?: VariableNode[];
  imports?: ImportNode[];
  functionCalls?:  string[]
}

export interface TsFile {
  imports: ImportNode[];
  exports: ExportNode[];
  variableDeclarations: VariableNode[];
  functionBlocks: FunctionBlock[];
}