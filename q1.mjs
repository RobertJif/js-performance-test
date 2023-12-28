// Explain the result below, why single ran of a function is slower but in 10_000x it is significantly faster
// TESTING 1 RUN
// fn1: 0.047ms
// fn2: 0.027ms

// TESTING 10000 RUN
// fn1: 7.704ms
// fn2: 22.167ms

// both function achieve the same result of mapping api response to ui state needs

const mapFn1 = (response) => {
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

const mapFn2 = (response) => {
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
