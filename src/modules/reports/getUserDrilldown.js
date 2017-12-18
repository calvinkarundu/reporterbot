import { log, writeToCsv } from '../../utils';
import { openDialog, postChatMessage } from '../slack/index';
import { getSession, setSession } from './sessions';

const generateData = async ({ startDate, endDate, username }) => {
  try {
    const userActivity = [];
    userActivity.push({
      username,
      startDate,
      endDate,
      loginCount: Math.floor(Math.random() * 20),
      itemsPurchased: Math.floor(Math.random() * 15),
      itemsReturned: Math.floor(Math.random() * 5),
    });

    return userActivity;
  } catch (err) {
    throw err;
  }
};

export const generateReport = async (options) => {
  try {
    const {
      args: {
        username,
        startDate,
        endDate,
      },
      reportFilePath,
    } = options;

    const userActivity = await generateData({
      username,
      startDate,
      endDate,
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

export const submit = async ({ slackReqObj }) => {
  try {
    const args = slackReqObj.submission;
    const reportKey = 'userDrilldown';
    return { args, reportKey };
  } catch (err) {
    throw err;
  }
};

export const dialog = async ({ slackReqObj }) => {
  const sessionId = `userDrilldown_${Date.now()}`;
  try {
    setSession(sessionId, {
      responseUrl: slackReqObj.response_url,
      callback: submit,
    });

    const dialogResponse = {
      callback_id: sessionId,
      title: 'User Drilldown',
      submit_label: 'Submit',
      elements: [{
        type: 'text',
        label: 'Username',
        name: 'username',
      }, {
        type: 'text',
        label: 'Start Date',
        name: 'startDate',
      }, {
        type: 'text',
        label: 'End Date',
        name: 'endDate',
      }],
    };

    const options = {
      dialog: dialogResponse,
      triggerId: slackReqObj.trigger_id,
    };

    await openDialog(options);
  } catch (err) {
    log.error(err);

    const session = getSession(sessionId);
    const { responseUrl } = session;

    const message = {
      responseUrl,
      replaceOriginal: false,
      text: 'Well this is embarrassing :sweat: I couldn\'t successfully get the report *User Drilldown*. Please try again later as I look into what went wrong.',
      mrkdwn: true,
      mrkdwn_in: ['text'],
    };
    postChatMessage(message)
      .catch((ex) => {
        log.error(ex);
      });
  }
};
