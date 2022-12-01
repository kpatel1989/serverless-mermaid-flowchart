import * as fs from 'fs';
import { join } from 'path';
import { buildMermaidGraph } from './graph-builder';
import { FunctionHandler } from './interfaces/function-handler';
import { Options, parseProject } from './parsers';

export async function generateGraph(options: Options) {
  console.log('Parsing Project');
  const projectMap: FunctionHandler[] | null = await parseProject(options);

  if (projectMap) {
    console.log('Generating mermaid Graph');
    const mermaidGraph = await buildMermaidGraph(projectMap);

    console.log('Writing mermaid Graph to readmefile');
    const outputFile = join(options.rootFolder, 'test-readme.md');
    await fs.writeFileSync(outputFile, mermaidGraph);
  }
}
