const inquirer = require('inquirer');
const fetch = require('node-fetch');

module.exports = {

    askForData: () => {
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

    getProjects: async (manifest, answers) => {
        let requestUrl = new URL('/api/v1/user/repos', answers.url);
        requestUrl.searchParams.append('token', answers.token);

        manifest.getRemoteInstance().fetch = requestUrl.origin;
        const response = await fetch(requestUrl.href);
        const data = await response.json();

        let projects = [];
        data.forEach(project => {
            projects.push({
                name: project.full_name,
                path: project.full_name,
                remote: manifest.remoteConfig.name
            });
        });

        return projects;
    }
};