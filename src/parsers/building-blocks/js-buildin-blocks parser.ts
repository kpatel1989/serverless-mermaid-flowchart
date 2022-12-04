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

interface VariableNode {}
interface ImportNode {
  variables: VariableNode[]
}

interface ExportNodes {
  functionBlock: FunctionBlock;
}
interface FunctionCall {
  variables: VariableNode[];
  functionCall: FunctionCall[];
}

interface FunctionBlock {
  variableDeclarations: VariableNode[];
  imports: ImportNode[];
  functionCalls:  FunctionCall[]
}

interface TsFile {
  imports: ImportNode[];
  exports: ExportNodes[];
  variableDeclarations: VariableNode[];
  functionBlocks: FunctionBlock[];

}