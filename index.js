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

const run = async (provider, options) => {
    try {
        let xmlManifest = new manifest();
        
        let projects = await provider.getProjects(xmlManifest, options);        
        xmlManifest.addProjects(projects);

        let outputFile = await inquirer.getOrAskForOutputFile(options);
        helper.writeFile(xmlManifest.toXml(), outputFile);
    } catch (err) {
        console.log(err);
    }
};

program.version(helper.getPackageVersion());

program
    .command('gitea')
    .description('Generate manifest from the authenticated gitea user')
    .option('-a, --access_token <access_token>', 'required access-token to allow api calls')
    .option('-o, --output-file [output_file]', 'name of the output file')
    .option('-u, --url <url>', 'required url or ip address of the host')
    .action((profile, args) => {
        let access_token = args.access_token;
        if (!access_token) {
            console.error('Error: The access-token is missing.');
            process.exit(1);
        }

        let url = args.url;
        if (!url) {
            console.error('Error: The url is missing.');
            process.exit(1);
        }

        args.profile = profile;
        run(require('./lib/provider/gitea'), args);
    });

program
    .command('github <profile>')
    .description('Generate manifest from github a given profile')
    .option('-o, --output-file [output_file]', 'name of the output file')
    .option('-t, --token [token]', 'optional auth-token to include private repositories')
    .action((profile, args) => {
        args.profile = profile;
        run(require('./lib/provider/github'), args);
    });

program
    .command('gitlab <profile>')
    .description('Generate manifest from a given gitlab profile')
    .option('-t, --token [token]', 'optional auth-token to include private repositories')
    .option('-o, --output-file [output_file]', 'name of the output file')
    .option('-u, --url [url]', 'optional url or ip address of running gitlab instance')
    .action((profile, args) => {
        args.profile = profile;
        run(require('./lib/provider/gitlab'), args);
    });

program
    .command('url <url>')
    .description('Generate manifest from url')
    .option('-t, --token [token]', 'optional auth-token to include private repositories')
    .option('-o, --output-file [output_file]', 'optional name of the output file')
    .action((url, args) => {
        args.url = url;
        run(require('./lib/provider/url'), args);
    });

program
    .command('*')
    .action(function () {
        console.error('Invalid command.\nSee --help for a list of available commands.');
        process.exit(1);
    });

program.parse(process.argv);