process.env.DISABLE_STATS = 'true'

const path = require('path')
const uuid = require('uuid')

const core = require('@actions/core');

const { createProbot } = require('probot')

const githubToken = process.env.GITHUB_TOKEN
const event = process.env.GITHUB_EVENT_NAME
const payloadPath = process.env.GITHUB_EVENT_PATH
const payload = require(path.resolve(payloadPath))

const probot = createProbot({
  cert: null,
  githubToken
})

// TODO: allow path to handler to be specified externally
probot.setup([ './index.js' ])

core.debug(`Receiving event ${ JSON.stringify(event) }`)
probot.receive({ name: event, payload, id: uuid.v4() }).catch((err) => {
  // setFailed logs the message and sets a failing exit code
  core.setFailed(`Action failed with error ${err}`);
})
