import { FunctionHandler } from '../interfaces/function-handler';

export const buildMermaidGraph = async (functionHandlers: FunctionHandler[]): Promise<string> => {
    let mermaidStr = 'graph LR\n';
    mermaidStr += functionHandlers.map(fn => {
        return fn.handler.length === 0 ? `${fn.function}-->End` : fn.handler.map(fnHandler => {
            return `${fn.function}-->${fnHandler}`;
        }).join('\n');
    }).join('\n');
    mermaidStr = '```mermaid\n' + mermaidStr + '\n```';
    return mermaidStr;
}