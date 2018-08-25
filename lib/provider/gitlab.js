const Gitlab = require('gitlab/dist/es5').default;
const inquirer = require('inquirer');

module.exports = {
    
    askCredentials: () => {
        const questions = [
            {
                name: 'url',
                type: 'input',
                message: 'Enter a custom GitLab URL, or use the default one:',
                default: 'https://gitlab.com',
                validate: function (value) {
                    try {
                        new URL(value);
                        return true;
                    } catch (_) {
                        return false;
                    }
                }
            },
            {
                name: 'token',
                type: 'input',
                message: 'GitLab requires a user generated token to access their API. Please create one and paste it here:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your GitLab API token.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },

    getProjects: async (profileName) => {
        let answers = await module.exports.askCredentials();

        const service = new Gitlab({
            url: answers.url,
            token: answers.token
        });

        let response = await service.Users.projects(profileName);
        return response;
    }
};