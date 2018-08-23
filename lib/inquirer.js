const inquirer = require('inquirer');

module.exports = {

    askRepoLocation: () => {
        const questions = [{
            type: 'list',
            name: 'location',
            message: 'Where are the projects located:',
            choices: ['GitHub', 'GitLab'],
            validate: function (value) {
                if (value === 'GitHub' || value === 'GitLab') {
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
    },

    askRemoteName: () => {
        const questions = [{
            type: 'input',
            name: 'remote',
            message: 'Give the default remote a name:',
            default: 'origin',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a name for the default remote.';
                }
            }
        }];
        return inquirer.prompt(questions);
    },

    askProfileName: () => {
        const questions = [{
            type: 'input',
            name: 'name',
            message: 'Enter a profile name to fetch its projects:',
            default: 'dotwee',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a profile name to fetch its projects.';
                }
            }
        }];
        return inquirer.prompt(questions);
    }
};