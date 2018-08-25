const octokit = require('@octokit/rest')();
const inquirer = require('inquirer');

module.exports = {

    askForData: async () => {
        const questions = [{
            type: 'input',
            name: 'name',
            message: 'Enter a GitHub profile name to fetch its projects:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a GitHub profile name to fetch its projects.';
                }
            }
        }];
        
        return inquirer.prompt(questions);
    },

    getProjects: async (manifest, answers) => {
        let projects = [];

        // Assume its an organization
        try {
            let response = await octokit.repos.getForOrg({
                org: answers.name
            });

            response.data.forEach(project => {
                projects.push(
                    {
                        name: project.name,
                        path: project.name,
                        remote: manifest.remoteConfig.name
                    }
                );
            });
            return projects;
        } catch (err) {
            if (err) {
                if (err.code == 404) {
                    // Its not a organization... lets try as user
                    let response = await octokit.repos.getForUser({
                        username: answers.name
                    });

                    response.data.forEach(project => {
                        projects.push(
                            {
                                name: project.name,
                                path: project.name,
                                remote: manifest.remoteConfig.name
                            }
                        );
                    });
                    return projects;
                } else throw err;
            }
        }
    }
};