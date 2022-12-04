exports.testFun1 = (arg: any) => {
  let a = [];
  constFunction();
  objTest2.test(a);
  anotherType2();
};

exports.testFun2 = async (arg: any) => {
  constFunction();
  anotherType();
  await constFunction2();
  traditionalFunction2();
  await anotherType2();
};

exports.testFun3 = function() {
  
}

exports.objTest = 'Hello'
const objTest2 = {
  test: (arg) => {

  }
}

export const CONST_OBJ = [];
export const constFunction = () => {};
export const constFunction2 = async () => {
  return objTest2.test(traditionalFunction);
};
export const constFunction3 = async () => objTest2.test;

export const anotherType = function () {};
export const anotherType2 = async function () {};

export function traditionalFunction() {}
export async function traditionalFunction2() {}

module.exports = () => {}
module.exports = async () => {}

module.exports.test = () => {}
module.exports.test2 = async () => {}

// Not covered yet.
module.exports = {
  CONST_OBJ,
  f1: anotherType,
  f2: traditionalFunction,
  f3: () => {},
  constFunction
};

function test() {

}
module.exports = test;