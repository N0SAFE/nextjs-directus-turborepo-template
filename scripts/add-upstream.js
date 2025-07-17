#!/usr/bin/env node
const { execSync } = require('child_process');
const REMOTE_NAME = 'upstream';
const REMOTE_URL = 'https://github.com/N0SAFE/nextjs-directus-turborepo-template.git';

function hasUpstream() {
  try {
    const remotes = execSync('git remote', { encoding: 'utf8' });
    return remotes.split(/\r?\n/).includes(REMOTE_NAME);
  } catch (e) {
    return false;
  }
}

function addUpstream() {
  if (hasUpstream()) {
    console.log(`Remote '${REMOTE_NAME}' already exists.`);
    return;
  }
  try {
    execSync(`git remote add ${REMOTE_NAME} ${REMOTE_URL}`);
    execSync(`git remote set-url --push ${REMOTE_NAME} no_push`);
    console.log(`Added remote '${REMOTE_NAME}': ${REMOTE_URL} (read-only, no push)`);
  } catch (e) {
    console.error('Failed to add upstream remote:', e.message);
    process.exit(1);
  }
}

addUpstream();
