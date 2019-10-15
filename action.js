#!/usr/bin/env node
// Usage: probot receive -e push -p path/to/payload app.js

process.env.DISABLE_STATS = 'true'

const path = require('path')
const uuid = require('uuid')
const program = require('commander')

const core = require('@actions/core');

const { createProbot } = require('probot')

program
  .usage('[options] [path/to/app.js...]')
  .option('-e, --event <event-name>', 'Event name', process.env.GITHUB_EVENT_NAME)
  .option('-p, --payload-path <payload-path>', 'Path to the event payload', process.env.GITHUB_EVENT_PATH)
  .parse(process.argv)

const githubToken = process.env.GITHUB_TOKEN

if (!program.event || !program.payloadPath) {
  program.help()
}

const payload = require(path.resolve(program.payloadPath))

const probot = createProbot({
  cert: null,
  githubToken: githubToken
})

// TODO: allow path to handler to be specified externally
const args = program.args.length && program.args || [ './index.js' ]
core.debug(`Setting up Probot with args ${ JSON.stringify(args) }`)
probot.setup(args)

core.debug(`Receiving event ${ JSON.stringify(program.event) }`)
probot.receive({ name: program.event, payload, id: uuid.v4() }).catch((err) => {
  // setFailed logs the message and sets a failing exit code
  core.setFailed(`Action failed with error ${err}`);
})
