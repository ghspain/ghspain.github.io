const core = require('@actions/core');
const github = require('@actions/github');
const { syncIssue } = require('./lib/core');

async function run() {
  try {
    const jsonPath = core.getInput('json-path') || 'public/data/issues.json';
    const payload = github.context.payload;
    if (!payload || !payload.issue) throw new Error('No issue payload available');
    await syncIssue(payload.issue, payload.action || 'unknown', jsonPath);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
