#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');

const manifest = require('./lib/provider/manifest');
const inquirer = require('./lib/tools/inquirer');
const helper = require('./lib/tools/helper');

clear();
console.log(
    chalk.white(
        figlet.textSync('repogen', {
            horizontalLayout: 'full'
        })
    )
);

const run = async () => {
    try {
        const answersMain = await inquirer.askProjectsProvider();
        let provider;

        if (answersMain.provider === 'Gitea') {
            provider = require('./lib/provider/gitea');
        } else if (answersMain.provider === 'GitHub') {
            provider = require('./lib/provider/github');
        } else {
            provider = require('./lib/provider/gitlab');
        }

        let manif = new manifest();
        let answersData = await provider.askForData();

        let projects = await provider.getProjects(manif, answersData);
        manif.addProjects(projects);

        let fileName = await inquirer.getOrAskForOutputFile();
        helper.writeFile(manif.toXml(), fileName);
    } catch (err) {
        let code;

        if (err.code) {
            code = err.code;
        } else if (err.statusCode) {
            code = err.statusCode;
        }

        switch (code) {
            case 404:
                console.log('This profile doesnt exist!');
                break;
            default:
                console.log(err);
        }
    }
}


program
    .version('1.0.0')
    .option('-p, --profile-name [value]', 'Profile name')
    .option('-r, --remote-name [value]', 'Remote name')
    .option('-o, --output-file [value]', 'File name')
    .parse(process.argv);

run();