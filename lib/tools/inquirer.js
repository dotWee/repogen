const inquirer = require('inquirer');
const helper = require('./helper');
const config = require('config');

module.exports = {

    getOrAskForOutputFile: async () => {
        let fileName = config.get('outputFile');

        const questions = [{
            type: 'input',
            name: 'outputFile',
            message: 'Enter output filename:',
            default: fileName,
            validate: function (value) {
                if (helper.isString(value)) {
                    return true;
                } else {
                    return 'Please enter a output filename.';
                }
            }
        }];

        let answer = await inquirer.prompt(questions);
        fileName = answer.outputFile;
        return fileName;
    },

    askProjectsProvider: async () => {
        const questions = [{
            type: 'list',
            name: 'provider',
            message: 'Where are the projects located:',
            choices: ['GitHub', 'GitLab', 'Gitea'],
            validate: function (value) {
                if (value === 'GitHub' || value === 'GitLab' || value === 'Gitea') {
                    return true;
                } else {
                    return 'Please select one of the given locations.';
                }
            }
        }];
        return inquirer.prompt(questions);
    },

    askOutputFile: () => {
        const questions = [{
            type: 'input',
            name: 'outputFile',
            message: 'Enter output file:',
            default: 'default.xml',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a output file.';
                }
            }
        }];
        return inquirer.prompt(questions);
    }
};