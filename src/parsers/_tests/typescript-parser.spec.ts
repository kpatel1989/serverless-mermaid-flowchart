import * as fs from 'fs';
import * as path from 'path';
import { MermaidMap } from '../../interfaces/function-handler';
import { printNodeTree, TsFile } from '../typescript-file-parser';

describe('Parsing Typescript file', () => {
  test.skip('should identify all exported functions defined in the file', () => {
    const tsFile = new TsFile('test', path.resolve('src/parsers/_tests/mock-export-test-file.ts'), { ignoreList: [] });
    const result: MermaidMap[] = tsFile.parse();
    console.log(result);
    const expectedFunctionNames = [
      ['test.testFun1', ['constFunction', 'objTest2.test', 'anotherType2']],
      ['test.testFun2', ['constFunction', 'anotherType', 'constFunction2', 'traditionalFunction2', 'anotherType2']],
      ['test.testFun3', []],
      ['test.constFunction', []],
      ['test.constFunction2', []],
      ['test.constFunction3', []],
      ['test.anotherType', []],
      ['test.anotherType2', []],
      ['test.traditionalFunction', []],
      ['test.traditionalFunction2', []],
      ['test.Anonymous', []],
      ['test.Anonymous', []],
      ['test.test', []],
      ['test.test2', []],
    ];
    result.forEach((r, i) => {
      expect(r.lhs).toEqual(expectedFunctionNames[i][0]);
      expect(r.rhs).toEqual(expectedFunctionNames[i][1]);
    });
  });
  test.skip('should export Node tree to file', () => {
    return;
    const tree = printNodeTree(
      'test',
      path.resolve(
        '/Users/kartik.patel/Documents/newwave/ol-nw-watchlist/src/main/typescript/controller/watchlist-controller.ts'
      )
    );
    fs.writeFileSync(`${__dirname}/tree_2.txt`, tree);
  });
});
