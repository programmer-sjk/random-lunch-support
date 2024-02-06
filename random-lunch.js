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

function shuffleMembers(members) {
  return members.sort(() => Math.random() - 0.5);
}

const members = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
];

function splitMembers(members) {
  const results = [];
  const limit = 4;
  const memberCount = members.length;
  let countOfFourMember, countOfThreeMember, countOfFourTeam;

  const remainder = memberCount % limit;
  switch (remainder) {
    case 0:
    case 3:
      for (let i = 0; i < memberCount; i += limit) {
        results.push(members.slice(i, i + limit));
      }
      break;
    case 1:
      countOfFourMember = Math.floor(memberCount / limit) - 2;
      countOfThreeMember = 3;
      for (let i = 0; i < countOfFourMember; i++) {
        const start = i * limit;
        results.push(members.slice(start, start + limit));
      }

      countOfFourTeam = results.length;
      for (let i = 0; i < countOfThreeMember; i++) {
        const start = countOfFourTeam * 4 + i * 3;
        const eachTeam = members.slice(start, start + 3);
        if (eachTeam.length) {
          results.push(eachTeam);
        }
      }
      break;
    case 2:
      countOfFourMember = Math.floor(memberCount / limit) - 1;
      countOfThreeMember = 2;
      for (let i = 0; i < countOfFourMember; i++) {
        const start = i * limit;
        results.push(members.slice(start, start + limit));
      }

      countOfFourTeam = results.length;
      for (let i = 0; i < countOfThreeMember; i++) {
        const start = countOfFourTeam * 4 + i * 3;
        const eachTeam = members.slice(start, start + 3);
        if (eachTeam.length) {
          results.push(eachTeam);
        }
      }
      break;
  }

  return results;
}

function createMessage(members) {
  let message = '오늘의 랜덤런치!';
  for (const member of members) {
    message += `\n * ${member.join(', ')}`;
  }
  return message;
}

function showMessage(message) {
  console.log('안녕하세요. HR 담당자님! 오늘의 랜덤 런치 결과입니다!');
  console.log(message);
}
