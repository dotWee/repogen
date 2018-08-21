#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const github = require('./lib/github');

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
    const data = await github.getGithubProjects();
    console.log('Found some projects!');
    
    data.data.forEach(project => {
      console.log('Project URL:', project.html_url);
    });
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