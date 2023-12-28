// what will this file output being ran with node ?
let data = undefined;

setTimeout(function () {
  console.log("API Response incoming!");
  data = [1, 2, 3];
}, 1000);

while (!data) {
  if (data) console.log("data is ", data.join(", "));
}

console.log("all task is done");
