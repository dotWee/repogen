#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const xml = require('xml');
const manifest = require('./lib/manifest');

clear();
console.log(
  chalk.white(
    figlet.textSync('github_repo-gen', {
      horizontalLayout: 'full'
    })
  )
);

const run = async () => {
  try {
    const manif = await manifest.buildManifest();
    console.log('manifest:', JSON.stringify(manif));

  } catch (err) {
    if (err) {
      switch (err.code) {
        case 404:
          console.log('This GitHub profile doesnt exist!');
          break;
        default:
          console.log(err);
      }
    }
  }
}

run();