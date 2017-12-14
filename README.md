# ReporterBot

> A Slack bot for getting reports on demand



This repo was made for a Scotch.io article on [Building a Slack Bot with Modern Node.js Workflows](https://scotch.io/tutorials/building-a-slack-bot-with-modern-nodejs-workflows). Check out the article for a breakdown of what's going on and the needed prerequisites.



## Setup Configs

Create a `development.json` file in the `config` folder with the following content:

```json
{
  "slack": {
    "fileUploadUrl": "https://slack.com/api/files.upload",
    "reporterBot": {
        "fileUploadChannel": "#reporterbot_files",
        "botToken": "YOUR-BOT-TOKEN-HERE"
    }
  }
}
```



## Install Dependencies and Run

```bash
npm install && npm run dev
```
