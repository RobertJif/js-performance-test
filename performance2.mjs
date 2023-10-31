// this will show how cheap a Mutation compared to clone/copy/deep copy, because Memory allocation is cheap, while memory deallocation (GC) is not
// This will be very familiar to you, because this is very common in FE development, result from http request will be mapped again in FE side to add certain properties
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
setFlagsFromString("--expose_gc");
import response from "./data.mjs";

let LOOP_COUNT = 0;

const gc = runInNewContext("gc");

const mapWithMapper = (response) => {
  return response.map((s, index) => ({
    ...s,
    index,
  }));
};

const mapWithFor = (response) => {
  const result = [];
  for (let i = 0; i < response.length; i++) {
    const obj = { ...response[i], index: i };
    result.push(obj);
  }
  return result;
};
const mapWithForCopyMutated = (response) => {
  const myRes = { ...response };
  const result = [];
  for (let i = 0; i < myRes.length; i++) {
    const obj = myRes[i];
    obj["index"] = i;
    result.push(obj);
  }
  return result;
};

const mapWithForMutated = (response) => {
  for (let i = 0; i < response.length; i++) {
    const obj = response[i];
    obj["index"] = i;
  }
  return response;
};

console.log("TESTING 10000 RUN");
LOOP_COUNT = 10_000;
(() => {
  console.time("map with spread syntax finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithMapper(response);
  }
  console.timeEnd("map with spread syntax finish in: ");
  gc();
  console.time("for loop with spread syntax finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithFor(response);
  }
  console.timeEnd("for loop with spread syntax finish in: ");
  gc();
  console.time("mutating with copy for loop finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithForCopyMutated(response);
  }
  console.timeEnd("mutating with copy for loop finish in: ");
  gc();
  console.time("mutating for loop finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithForMutated(response);
  }
  console.timeEnd("mutating for loop finish in: ");
  gc();
})();

console.log("END");
gc();
console.log("");
console.log("");
console.log("");
console.log("TESTING 1 RUN");
LOOP_COUNT = 1;
(() => {
  console.time("map with spread syntax finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithMapper(response);
  }
  console.timeEnd("map with spread syntax finish in: ");
  gc();
  console.time("simple for loop finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithFor(response);
  }
  console.timeEnd("simple for loop finish in: ");
  gc();
  console.time("mutating with copy for loop finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithForCopyMutated(response);
  }
  console.timeEnd("mutating with copy for loop finish in: ");
  gc();
  console.time("mutating for loop finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithForMutated(response);
  }
  console.timeEnd("mutating for loop finish in: ");
  gc();
})();

console.log("END");
