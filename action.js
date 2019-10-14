const path = require('path');
const uuid = require('uuid');

const core = require('@actions/core');

const { createProbot } = require('probot');

// The name of the webhook event that triggered the workflow.
const event = process.env.GITHUB_EVENT_NAME;
core.debug(`Got event: ${ event }`);

// The path of the file with the complete webhook event payload. For example, /github/workflow/event.json.
const payloadPath = process.env.GITHUB_EVENT_PATH;
core.debug(`Got payloadPath: ${ payloadPath }`);

// The GitHub App installation access token used to authenticate on behalf of the GitHub App installed on your repository
const githubToken = process.env.GITHUB_TOKEN;
core.debug(`Got token: ${ githubToken }`);

const payload = require(path.resolve(payloadPath));
core.debug(`Got payload: ${ payload }`);

const probot = createProbot({
  cert: null,
  githubToken: githubToken
});

probot.setup([ './index.js' ]);

probot.logger.info('Receiving event', event)
probot.receive({ name: event, payload, id: uuid.v4() }).catch(() => {
  // Process must exist non-zero to indicate that the action failed to run
  process.exit(1)
});
