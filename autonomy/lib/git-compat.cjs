'use strict';
const path = require('node:path');
const git = require(path.join(__dirname, 'git.cjs'));

function firstFn(obj, names) {
  for (const n of names) if (typeof obj[n] === 'function') return obj[n];
  return null;
}

const proposeDiff = firstFn(git, ['proposeDiff', 'propose', 'proposePatch']);
const applyDiff = firstFn(git, [
  'applyDiff',
  'apply',
  'applyPatch',
  'applyPatches',
]);
const assertClean = firstFn(git, ['assertClean', 'ensureClean', 'cleanAssert']);
const commit = firstFn(git, ['commit', 'commitAll', 'saveCommit']);

if (!proposeDiff || !applyDiff || !assertClean || !commit) {
  const have = Object.keys(git).filter((k) => typeof git[k] === 'function');
  throw new Error(
    'git-compat: missing required helpers. Have: ' + have.join(', '),
  );
}

module.exports = { ...git, proposeDiff, applyDiff, assertClean, commit };
