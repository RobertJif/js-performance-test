// This will show us the complex mapping running with reduce that use a spread syntax create a lot of memory, causing it to bottleneck in treads
// this example show us how two different approach to map same data to another structure
// here we map an error returned by http request to our version of error structure
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
setFlagsFromString("--expose_gc");

const response = {
  detail: [
    {
      loc: ["body", "data", 0, "rate"],
      msg: "none is not an allowed value",
      type: "type_error.none.not_allowed",
    },
    {
      loc: ["body", "data", 1, "rate2"],
      msg: "none is not an allowed value",
      type: "type_error.none.not_allowed",
    },
    {
      loc: ["body", "data", 2, "rate3"],
      msg: "none is not an allowed value",
      type: "type_error.none.not_allowed",
    },
  ],
};

const gc = runInNewContext("gc");
const mapWithPointer = (response) => {
  let result = {};
  let ref = result;

  if (Array.isArray(response.detail)) {
    for (let i = 0; i < response.detail.length; i++) {
      const detail = response.detail[i];
      const { loc, msg } = detail;
      const locLength = detail?.loc?.length ?? 0;

      if (locLength > 2) {
        for (let i = 1; i < locLength; i++) {
          if (ref[loc[i]]) {
            ref = ref[loc[i]];
            continue;
          }
          ref[loc[i]] = {};

          if (i === loc.length - 1) {
            ref[loc[i]] = msg;
            ref = result;
            break;
          }
          ref = ref[loc[i]];
        }
      } else {
        const [key1, key2] = detail.loc;

        result[key2 ?? key1] = detail.msg;
      }
    }
  } else {
    result["error_code"] = response.error_code;
  }

  return result;
};

const mapWithReduce = (response) => {
  let result = {};

  if (Array.isArray(response.detail)) {
    result = response.detail.reduce((total, detail) => {
      const locLength = detail?.loc?.length ?? 0;
      const [key1, key2] = detail.loc;
      if (locLength > 2) {
        let tempObj = {};
        for (let i = locLength - 1; i > 1; i--) {
          tempObj = {
            [detail.loc[i]]: i === locLength - 1 ? detail.msg : tempObj,
          };
        }
        return {
          ...total,
          [key2]: tempObj,
        };
      } else {
        return {
          ...total,
          [key2 ?? key1]: detail.msg,
        };
      }
    }, {});
  } else {
    result["error_code"] = response.error_code;
  }
  return result;
};

console.log("TESTING 10000 RUN");
let LOOP_COUNT = 10_000;
(() => {
  console.time("reduce with spread syntax finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithReduce(response);
  }
  console.timeEnd("reduce with spread syntax finish in: ");
  gc();
  console.time("pointer finish in: ");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithPointer(response);
  }
  console.timeEnd("pointer finish in: ");
  gc();
})();

console.log("END");
gc();
console.log("");
console.log("");
console.log("");
console.log("TESTING ONLY 1 RUN");

LOOP_COUNT = 1;
(() => {
  console.time("reduce");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithReduce(response);
  }
  console.timeEnd("reduce");
  gc();
  console.time("pointer");
  for (let i = 0; i < LOOP_COUNT; i++) {
    mapWithPointer(response);
  }
  console.timeEnd("pointer");
  gc();
})();

console.log("END");
