const readline = require("readline");
readline.emitKeypressEvents(process.stdin);

const message = `
  랜덤런치 리스트입니다.
  1조: A, B, C
  2조: D, E, F
`;

console.log(message);

process.stdin.setRawMode(true);
process.stdin.on("keypress", (key, data) => {
  if (data.name === "q") {
    process.exit();
  } else {
    console.log("key", key);
    console.log("data", data);
  }
});

console.log("Press a key");
