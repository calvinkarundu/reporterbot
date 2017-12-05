import path from 'path';
import config from 'config';

import { log, delay, fileExists, getReportFilesDir } from '../../utils';
import { postChatMessage, uploadFile } from '../slack';

// Reports
import getUserActivity from './getUserActivity';

const slackConfig = config.get('slack');

const REPORTS_CONFIG = {
  userActivity: {
    name: 'User Activity',
    namePrefix: 'userActivity',
    type: 'csv',
    func: getUserActivity,
  },
};

export const reportsList = Object.entries(REPORTS_CONFIG)
  .map(([key, value]) => {
    const report = {
      text: value.name,
      value: key,
    };
    return report;
  });

const generateReportImplAsync = async (options, { slackReqObj }) => {
  const {
    reportName,
    reportTmpName,
    reportType,
    reportFilePath,
    reportFunc,
  } = options;

  try {
    // Initiate report function
    await reportFunc();

    /*
      FIX ME::
      Delay hack to ensure previous fs call is done processing file
    */
    await delay(250);
    const reportExists = await fileExists(reportFilePath);

    if (reportExists === false) {
      const message = {
        responseUrl: slackReqObj.response_url,
        replaceOriginal: false,
        text: `There's currently no data for report *${reportName}*`,
        mrkdwn: true,
        mrkdwn_in: ['text'],
      };
      return postChatMessage(message)
        .catch((ex) => {
          log.error(ex);
        });
    }

    /*
      FIX ME::
      Delay hack to ensure previous fs call is done processing file
    */
    await delay(250);
    const uploadedReport = await uploadFile({
      filePath: reportFilePath,
      fileTmpName: reportTmpName,
      fileName: reportName,
      fileType: reportType,
      channels: slackConfig.reporterBot.fileUploadChannel,
    });
    const message = {
      responseUrl: slackReqObj.response_url,
      replaceOriginal: false,
      text: 'Your report is ready!',
      attachments: [{
        text: `<${uploadedReport.file.url_private}|${reportName}>`,
        color: '#2c963f',
        footer: 'Click report link to open menu with download option',
      }],
    };
    return postChatMessage(message)
      .catch((err) => {
        log.error(err);
      });
  } catch (err) {
    log.error(err);
    const message = {
      responseUrl: slackReqObj.response_url,
      replaceOriginal: false,
      text: `Well this is embarrassing :sweat: I couldn't successfully get the report *${reportName}*. Please try again later as I look into what went wrong.`,
      mrkdwn: true,
      mrkdwn_in: ['text'],
    };
    return postChatMessage(message)
      .catch((ex) => {
        log.error(ex);
      });
  }
};

export const generateReport = async (options) => {
  try {
    const { slackReqObj } = options;
    const reportKey = slackReqObj.actions[0].selected_options[0].value;
    const report = REPORTS_CONFIG[reportKey];

    if (report === undefined) {
      const slackReqObjString = JSON.stringify(slackReqObj);
      log.error(new Error(`reportKey: ${reportKey} did not match any reports. slackReqObj: ${slackReqObjString}`));
      const response = {
        response_type: 'in_channel',
        text: 'Hmmm :thinking_face: Seems like that report is not available. Please try again later as I look into what went wrong.',
      };
      return response;
    }

    const reportTmpName = `${report.namePrefix}_${Date.now()}.${report.type}`;
    const reportFilesDir = getReportFilesDir();
    const reportFilePath = path.join(reportFilesDir, reportTmpName);

    const reportParams = {
      reportName: report.name,
      reportTmpName,
      reportType: report.type,
      reportFilePath,
      reportFunc() {
        return report.func({ reportFilePath });
      },
    };

    // Begin async report generation
    generateReportImplAsync(reportParams, { slackReqObj });

    const response = {
      response_type: 'in_channel',
      text: `Got it :thumbsup: Generating requested report *${report.name}*\nPlease carry on, I'll notify you when I'm done.`,
      mrkdwn: true,
      mrkdwn_in: ['text'],
    };
    return response;
  } catch (err) {
    throw err;
  }
};
