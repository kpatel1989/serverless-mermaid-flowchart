import { generateGraph } from "..";
import { Options } from "../interfaces/Options";

describe('Test Graph generation', () => {
    const options: Options = {
        rootFolder: '/Users/kartik.patel/Documents/newwave/ol-nw-watchlist',
        projectType: 'Serverless',
        entryFile: 'src/main/typescript/handler.ts',
        ignoreList:  ['HttpRuntime.createHttpHandler']
      };
    test('should generate a mermaid graph for the test repo.', () => {
        generateGraph(options);
    });
})