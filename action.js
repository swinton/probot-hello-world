const path = require('path');
const uuid = require('uuid');

const { createProbot } = require('probot');

// The name of the webhook event that triggered the workflow.
const event = process.env.GITHUB_EVENT_NAME;

// The path of the file with the complete webhook event payload. For example, /github/workflow/event.json.
const payloadPath = process.env.GITHUB_EVENT_PATH;

// The GitHub App installation access token used to authenticate on behalf of the GitHub App installed on your repository
const githubToken = process.env.GITHUB_TOKEN;

const payload = require(path.resolve(payloadPath));

const probot = createProbot({
  cert: null,
  githubToken: githubToken
});

// probot.setup(program.args);
probot.receive({ name: event, payload, id: uuid.v4() }).catch(() => {
  // Process must exist non-zero to indicate that the action failed to run
  process.exit(1)
});
