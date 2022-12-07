import * as fs from 'fs';
import { join } from 'path';
import { Options } from './interfaces/Options';
import { buildMermaidGraph } from './graph-builder/graph-builder';
import { MermaidMap } from './interfaces/function-handler';
import { parseProject } from './parsers';

export async function generateGraph(options: Options) {
  console.log('Parsing Project');
  const projectMap: MermaidMap[] | null = await parseProject(options);

  if (projectMap) {
    console.log('Generating mermaid Graph');
    const mermaidGraph = await buildMermaidGraph(projectMap, options);

    console.log('Writing mermaid Graph to readmefile');
    const outputFile = join(options.rootFolder, 'test-readme.md');
    await fs.writeFileSync(outputFile, mermaidGraph);
  }
}
