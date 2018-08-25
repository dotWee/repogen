const inquirer = require('inquirer');
const fetch = require('node-fetch');

module.exports = {

    askCredentials: () => {
        const questions = [
            {
                name: 'url',
                type: 'input',
                message: 'Enter Gitea URL:',
                validate: function (value) {
                    try {
                        new URL(value);
                        return true;
                    } catch (_) {
                        return 'Please enter a valid URL.';
                    }
                }
            },
            {
                name: 'token',
                type: 'input',
                message: 'Gitea requires a user generated token for authorization. Please create one and paste it here:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your Gitea access token.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },

    getUrl: async () => {
        let answers = await module.exports.askCredentials();
        let requestUrl = new URL('/api/v1/user/repos', answers.url);
        requestUrl.searchParams.append('token', answers.token);

        return requestUrl;
    },

    getProjects: async (requestUrl) => {

        const response = await fetch(requestUrl.href);
        console.log('response', response);

        const projects = await response.json();
        console.log('projects', projects);

        return projects;
    }
};