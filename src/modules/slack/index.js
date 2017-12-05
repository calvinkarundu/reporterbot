import fs from 'fs';
import config from 'config';
import request from 'request';

const slackConfig = config.get('slack');

export const postChatMessage = message => new Promise((resolve, reject) => {
  const {
    responseUrl,
    channel = null,
    text = null,
    attachments = null,
    replaceOriginal = null,
  } = message;

  const payload = {
    response_type: 'in_channel',
  };

  if (channel !== null) payload.channel = channel;
  if (text !== null) payload.text = text;
  if (attachments !== null) payload.attachments = attachments;
  if (replaceOriginal !== null) payload.replace_original = replaceOriginal;

  request.post({
    url: responseUrl,
    body: payload,
    json: true,
  }, (err, response, body) => {
    if (err) {
      reject(err);
    } else if (response.statusCode !== 200) {
      reject(body);
    } else if (body.ok !== true) {
      const bodyString = JSON.stringify(body);
      reject(new Error(`Got non ok response while posting chat message. Body -> ${bodyString}`));
    } else {
      resolve(body);
    }
  });
});

export const uploadFile = options => new Promise((resolve, reject) => {
  const {
    filePath,
    fileTmpName,
    fileName,
    fileType,
    channels,
  } = options;

  const payload = {
    token: slackConfig.reporterBot.botToken,
    file: fs.createReadStream(filePath),
    channels,
    filetype: fileType,
    filename: fileTmpName,
    title: fileName,
  };

  request.post({
    url: slackConfig.fileUploadUrl,
    formData: payload,
    json: true,
  }, (err, response, body) => {
    if (err) {
      reject(err);
    } else if (response.statusCode !== 200) {
      reject(body);
    } else if (body.ok !== true) {
      const bodyString = JSON.stringify(body);
      reject(new Error(`Got non ok response while uploading file ${fileTmpName} Body -> ${bodyString}`));
    } else {
      resolve(body);
    }
  });
});
