exports.testFun1 = (arg: any) => {
  let a = [];
  constFunction();
  objTest2.test();
};
exports.testFun2 = async (arg: any) => {
  constFunction();
  anotherType();
  await constFunction2();
  traditionalFunction2();
};

exports.objTest = 'Hello'
const objTest2 = {
  test: () => {

  }
}

export const CONST_OBJ = [];
export const constFunction = () => {};
export const constFunction2 = async () => {};

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