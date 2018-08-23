#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const xml = require('xml');
const program = require('commander');

const manifest = require('./lib/provider/manifest');
const inquirer = require('./lib/inquirer');
const helper = require('./lib/helper');

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
        const manif = await manifest.buildManifest();
        console.log('manifest:', JSON.stringify(manif));

        await manifest.writeToFile(manif);
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


program
    .version('1.0.0')
    .option('-p, --profile-name [value]', 'Profile name')
    .option('-r, --remote-name [value]', 'Remote name')
    .option('-o, --output-file [value]', 'File name')
    .parse(process.argv);

run();