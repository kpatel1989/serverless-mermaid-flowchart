import { MermaidMap } from '../interfaces/function-handler';
import { Options } from '../interfaces/Options';

export const buildMermaidGraph = async (mermaidMap: MermaidMap[], options: Options): Promise<string> => {
    let mermaidStr = 'graph LR\n';
    mermaidStr += mermaidMap.map(fn => {
        if (options.ignoreList.includes(fn.lhs)) {
            return ''
        }
        return fn.rhs.length === 0 ? `${fn.lhs}-->End` : fn.rhs.map(rhs => {
            if (options.ignoreList.includes(rhs)) {
                return ''
            }
            return `${fn.lhs}-->${rhs}`;
        }).join('\n');
    }).join('\n');
    mermaidStr = '```mermaid\n' + mermaidStr + '\n```';
    mermaidStr = mermaidStr.replace(/(\n)+/g,'\n');
    return mermaidStr;
}