const Gitlab = require('gitlab/dist/es5').default;
const inquirer = require('inquirer');

module.exports = {
    
    askCredentials: () => {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a GitLab profile name to fetch its projects:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a GitLab profile name to fetch its projects.';
                    }
                }
            },
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

    getProjects: async (manifest, answers) => {

        const service = new Gitlab({
            url: answers.url,
            token: answers.token
        });

        const response = await service.Users.projects(answers.name);
        let projects = [];

        response.forEach(project => {
            projects.push({
                name: project.name,
                path: project.name,
                remote: manifest.remoteConfig.name
            });
        });
        
        return projects;
    }
};