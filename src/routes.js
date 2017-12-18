import express from 'express';

import { log } from './utils';
import { reportsList, generateReport, handleDialog } from './modules/reports';

const router = new express.Router();

router.post('/slack/command/report', async (req, res) => {
  try {
    const slackReqObj = req.body;

    const response = {
      response_type: 'in_channel',
      channel: slackReqObj.channel_id,
      text: 'Hello :slightly_smiling_face:',
      attachments: [{
        text: 'What report would you like to get?',
        fallback: 'What report would you like to get?',
        color: '#2c963f',
        attachment_type: 'default',
        callback_id: 'report_selection',
        actions: [{
          name: 'reports_select_menu',
          text: 'Choose a report...',
          type: 'select',
          options: reportsList,
        }],
      }],
    };

    return res.json(response);
  } catch (err) {
    log.error(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
});

router.post('/slack/actions', async (req, res) => {
  try {
    const slackReqObj = JSON.parse(req.body.payload);
    let response;

    if (slackReqObj.callback_id === 'report_selection') {
      response = await generateReport({ slackReqObj });
    }

    if (slackReqObj.type === 'dialog_submission') {
      response = await handleDialog({ slackReqObj });
    }

    return typeof response === 'number'
      ? res.sendStatus(response)
      : res.json(response);
  } catch (err) {
    log.error(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
});

export default router;
