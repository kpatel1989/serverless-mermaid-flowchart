import { generateGraph } from "..";
import { Options } from "../parsers";

describe('Test Graph generation', () => {
    const options: Options = {
        rootFolder: '/Users/kartik.patel/Documents/newwave/ol-nw-watchlist',
        projectType: 'Serverless',
        entryFile: 'src/main/typescript/handler.ts',
      };
    it('should generate a mermaid graph for the test repo.', async() => {
        await generateGraph(options);
        
    });
})