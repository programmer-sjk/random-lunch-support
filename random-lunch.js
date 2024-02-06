import readline from 'readline';
import clipboardy from 'clipboardy';
readline.emitKeypressEvents(process.stdin);

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

process.stdin.setRawMode(true);
process.stdin.on('keypress', async (k, data) => {
  if (data.name === 'r') {
    await doProcess();
  } else {
    process.exit();
  }
});

await doProcess();
async function doProcess() {
  const message = createMessage(splitMembers(shuffleMembers(members)));
  await clipboardy.write(message);
  showMessage(message);
}

function shuffleMembers(members) {
  return members.sort(() => Math.random() - 0.5);
}

function splitMembers(members) {
  const limit = 4;
  const memberCount = members.length;
  let countOfFourMember, countOfThreeMember;

  const remainder = memberCount % limit;
  switch (remainder) {
    case 0:
    case 3:
      const results = [];
      for (let i = 0; i < memberCount; i += limit) {
        results.push(members.slice(i, i + limit));
      }
      return results;
    case 1:
      countOfFourMember = Math.floor(memberCount / limit) - 2;
      countOfThreeMember = 3;
      return splitByTeamCount(countOfFourMember, countOfThreeMember, limit);
    case 2:
      countOfFourMember = Math.floor(memberCount / limit) - 1;
      countOfThreeMember = 2;
      return splitByTeamCount(countOfFourMember, countOfThreeMember, limit);
    default:
      throw new Error(`Server Error, remainder=${remainder}`);
  }
}

function splitByTeamCount(
  countOfFourMember,
  countOfThreeMember,
  increaseAmount,
) {
  const results = [];
  for (let i = 0; i < countOfFourMember; i++) {
    const start = i * increaseAmount;
    results.push(members.slice(start, start + increaseAmount));
  }

  const countOfFourTeam = results.length;
  for (let i = 0; i < countOfThreeMember; i++) {
    const start = countOfFourTeam * 4 + i * 3;
    const eachTeam = members.slice(start, start + 3);
    if (eachTeam.length) {
      results.push(eachTeam);
    }
  }

  return results;
}

function createMessage(members) {
  let message = '오늘의 랜덤런치!';
  for (const member of members) {
    message += `\n - ${member.join(', ')}`;
  }
  return message;
}

function showMessage(message) {
  console.log('안녕하세요. HR 담당자님!');
  console.log(message);
  console.log(
    '재실행은 R 입력, 다른 키는 랜덤 런치 결과가 클립보드에 복사되며 종료됩니다.',
  );
}
