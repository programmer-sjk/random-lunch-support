import readline from 'readline';
import clipboardy from 'clipboardy';
readline.emitKeypressEvents(process.stdin);

const message = `
  랜덤런치 리스트입니다.
  1조: A, B, C
  2조: D, E, F
`;

console.log(message);

process.stdin.setRawMode(true);
process.stdin.on('keypress', async (_, data) => {
  if (data.name === 'r') {
    // shuffleMembers();
    // showMessage();
    console.log('Press a key');
  } else {
    await clipboardy.write(message);
    process.exit();
  }
});

console.log('Press a key');
