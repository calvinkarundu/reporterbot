import path from 'path';
import fs from 'fs';
import csvWriter from 'csv-write-stream';

import { log, delay, getReportFilesDir } from '../../utils';

const generateData = async ({ startDate, endDate, totalRecords }) => {
  try {
    // Delay imitating async call
    await delay(3000);

    const userActivity = [];
    for (let index = 0; index < totalRecords; index += 1) {
      userActivity.push({
        username: `user_${index + 1}`,
        startDate,
        endDate,
        loginCount: Math.floor(Math.random() * 20),
        itemsPurchased: Math.floor(Math.random() * 15),
        itemsReturned: Math.floor(Math.random() * 5),
      });
    }

    return userActivity;
  } catch (err) {
    throw err;
  }
};

const writeToCsv = ({ userActivity, reportTmpName }) => {
  const reportFilesDir = getReportFilesDir();
  const reportFilePath = path.join(reportFilesDir, reportTmpName);

  const writer = csvWriter({
    headers: [
      'Username',
      'Start Date',
      'End Date',
      'Login Count',
      'Items Purchased',
      'Items Returned',
    ],
  });

  const records = userActivity.map(record => [
    record.username,
    record.startDate,
    record.endDate,
    record.loginCount,
    record.itemsPurchased,
    record.itemsReturned,
  ]);

  log.info(`Compiling ${records.length} results...`);

  writer.pipe(fs.createWriteStream(reportFilePath));
  records.forEach(r => writer.write(r));
  writer.end();

  log.info(`Results compiled into ${reportFilePath}`);
};

export default async (options) => {
  try {
    const {
      startDate = '2017-11-25',
      endDate = '2017-11-28',
      totalRecords = 20,
      reportTmpName = 'userActivity.csv',
    } = options;

    const userActivity = await generateData({
      startDate,
      endDate,
      totalRecords,
    });

    if (userActivity.length > 0) {
      writeToCsv({ userActivity, reportTmpName });
    }
  } catch (err) {
    throw err;
  }
};
