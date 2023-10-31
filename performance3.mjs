// this to show us a component is just a function that return html, the way we use a function is important
// outer function below being only created and allocated to memory once (because it's outside closure) is important
// because recreation of function inside a function is very taxing on memory
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
setFlagsFromString("--expose_gc");
let LOOP_COUNT = 0;
const outerFn1 = (str) => {
  switch (str) {
    case "a":
      return "<div>a</div>";
    case "b":
      return "<span>b</span>";

    default:
      return "<h1>default</h1>";
  }
};
const outerFn2 = (str) => {
  switch (str) {
    case "a":
      return "<div>a</div>";
    case "b":
      return "<span>b</span>";

    default:
      return "<h1>default</h1>";
  }
};

const handleRenderWithInner = (res) => {
  const innerFn1 = function (str) {
    switch (str) {
      case "a":
        return "<div>a</div>";
      case "b":
        return "<span>b</span>";

      default:
        return "<h1>default</h1>";
    }
  };
  const innerFn2 = function (str) {
    switch (str) {
      case "a":
        return "<div>a</div>";
      case "b":
        return "<span>b</span>";

      default:
        return "<h1>default</h1>";
    }
  };
  return `<div>${innerFn1("a")}${innerFn2("b")}</div>`;
};
const handleRenderWithOuter = () => {
  return `<div>${outerFn1("a")}${outerFn2("b")}</div>`;
};

const gc = runInNewContext("gc");

console.log("TESTING 10000 RUN");
LOOP_COUNT = 10_000;
(() => {
  gc();
  console.log();
  console.log("render with inner function start");
  console.time("render with inner function finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    handleRenderWithInner();
  }
  console.timeEnd("render with inner function finish in: ");
  gc();
  console.log();
  console.log("render with outer function start");
  console.time("render with outer function finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    handleRenderWithOuter();
  }
  console.timeEnd("render with outer function finish in: ");
  gc();
})();

console.log("END");
console.log();
console.log("TESTING 1 RUN");
LOOP_COUNT = 1;
(() => {
  gc();
  console.log();
  console.log("render with inner function start");
  console.time("render with inner function finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    handleRenderWithInner();
  }
  console.timeEnd("render with inner function finish in: ");
  gc();
  console.log();
  console.log("render with outer function start");
  console.time("render with outer function finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    handleRenderWithOuter();
  }
  console.timeEnd("render with outer function finish in: ");
  gc();
})();

console.log("END");
