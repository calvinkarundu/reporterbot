import { log, writeToCsv } from '../../utils';

const generateData = async ({ startDate, endDate, totalRecords }) => {
  try {
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

export default async (options) => {
  try {
    const {
      startDate = '2017-11-25',
      endDate = '2017-11-28',
      totalRecords = 20,
      reportFilePath,
    } = options;

    const userActivity = await generateData({
      startDate,
      endDate,
      totalRecords,
    });

    if (userActivity.length > 0) {
      const headers = [
        'Username',
        'Start Date',
        'End Date',
        'Login Count',
        'Items Purchased',
        'Items Returned',
      ];

      const records = userActivity.map(record => [
        record.username,
        record.startDate,
        record.endDate,
        record.loginCount,
        record.itemsPurchased,
        record.itemsReturned,
      ]);

      const filePath = reportFilePath;
      writeToCsv({ headers, records, filePath });
      log.info(`${records.length} records compiled into ${filePath}`);
    }
  } catch (err) {
    throw err;
  }
};
