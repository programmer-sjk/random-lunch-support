const readline = require('readline');
const clipboardy = require('clipboardy');
const xlsx = require('xlsx');
const chalk = require('chalk');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', async (_, data) => {
  if (data.name === 'r') {
    await doProcess();
  } else {
    process.exit();
  }
});

doProcess();
async function doProcess() {
  const message = createMessage(
    splitMembers(shuffleMembers(getAttendanceMemberFromExcel())),
  );
  await clipboardy.write('오늘의 랜덤런치! \n' + message);
  showMessage(message);
}

function getAttendanceMemberFromExcel() {
  const workbook = xlsx.readFile('random_lunch.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const range = xlsx.utils.decode_range(sheet['!ref']);
  const rowCount = range.e.r;

  const members = [];
  for (let i = 2; i <= rowCount; i++) {
    const name = sheet[`A${i}`];
    const attendance = sheet[`B${i}`];

    if (isInvalid(name, attendance)) {
      continue;
    }
    members.push(name.v);
  }
  return members;
}

function isInvalid(name, attendance) {
  if (!name || !attendance) {
    return true;
  }

  if (!name.v.trim()) {
    return true;
  }

  const attendanceValue = attendance.v;
  if (typeof attendanceValue === 'string' && !attendanceValue.trim()) {
    return true;
  }
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
      return splitByTeamCount(
        members,
        countOfFourMember,
        countOfThreeMember,
        limit,
      );
    case 2:
      countOfFourMember = Math.floor(memberCount / limit) - 1;
      countOfThreeMember = 2;
      return splitByTeamCount(
        members,
        countOfFourMember,
        countOfThreeMember,
        limit,
      );
    default:
      throw new Error(`Server Error, remainder=${remainder}`);
  }
}

function splitByTeamCount(
  members,
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
  let message = '\n';
  for (const member of members) {
    message += ` • ${member.join(', ')}\n`;
  }
  return message;
}

function showMessage(message) {
  console.log(chalk.green('안녕하세요. HR 담당자님!'));
  console.log(chalk.green('오늘의 랜덤런치!'));
  console.log(chalk.magentaBright(message));
  console.log(
    chalk.green(
      '재실행은 R 입력, 다른 키는 랜덤 런치 결과가 클립보드에 복사되며 종료됩니다.',
    ),
  );
}
