process.env.DISABLE_STATS = 'true'

const path = require('path')
const uuid = require('uuid')

const core = require('@actions/core')

const { createProbot } = require('probot')

module.exports = (handler) => {
  // Setup Probot app
  const githubToken = process.env.GITHUB_TOKEN
  const probot = createProbot({ githubToken })
  probot.setup([ handler ])

  // Process the event
  const event = process.env.GITHUB_EVENT_NAME
  const payloadPath = process.env.GITHUB_EVENT_PATH
  const payload = require(path.resolve(payloadPath))
  core.debug(`Receiving event ${ JSON.stringify(event) }`)
  probot.receive({ name: event, payload, id: uuid.v4() }).catch((err) => {
    // setFailed logs the message and sets a failing exit code
    core.setFailed(`Action failed with error ${err}`)
  })
}
