import express from 'express';
import { log } from './utils';

const router = new express.Router();

async function handleSlackActions(req, res) {
  try {
    const response = {};
    return res.json(response);
  } catch (err) {
    log.error(err);
    return res.status(500).send('Damn something blew up!');
  }
}

async function handleSlackReportCommand(req, res) {
  try {
    const response = {};
    return res.json(response);
  } catch (err) {
    log.error(err);
    return res.status(500).send('Damn something blew up!');
  }
}

// Set route handlers
router.post('/slack/actions', handleSlackActions);
router.post('/slack/command/report', handleSlackReportCommand);
export default router;
