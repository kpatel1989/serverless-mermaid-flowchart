import * as path from 'path';
import { FunctionHandler } from '../../interfaces/function-handler';
import { parseTypeScriptFile } from '../typescript-parser';

describe('Parsing Typescript file', () => {
  it('should identify all exported functions defined in the file', async () => {
    const result:FunctionHandler[] = await parseTypeScriptFile(
      'test',
      path.resolve('src/parsers/_tests/mock-export-test-file.ts')
    );
    console.log(result);
    const expectedFunctionNames = [
      'test.testFun1',
      'test.testFun2',
      'test.constFunction',
      'test.constFunction2',
      'test.anotherType',
      'test.anotherType2',
      'test.traditionalFunction',
      'test.traditionalFunction2',
      'test.Anonymous',
      'test.Anonymous',
      'test.test',
      'test.test2',
    ];
    result.forEach((r, i) => {
      expect(r.function).toEqual(expectedFunctionNames[i]);
    });
  });
});
