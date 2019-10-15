const probotActionsAdapter = require('./lib/probot-actions-adapter')

const handler = require('./index')

probotActionsAdapter(handler)
