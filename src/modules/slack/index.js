import config from 'config';
import { WebClient } from '@slack/client';

const slackConfig = config.get('slack');

export const uploadFile = options => new Promise((resolve, reject) => {
  // Upload code here...
});

export const postChatMessage = message => new Promise((resolve, reject) => {
  // Post chat code here...
});
