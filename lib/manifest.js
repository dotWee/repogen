const inquirer = require('./inquirer');
const github = require('./github');

module.exports = {
    buildManifest: async () => {
        let manifest = {
            manifest: []
        };

        // Get data
        const response_projects = await github.getGithubProjects();
        const response_remote = await inquirer.askRemoteName();
        console.log('Found %s projects.', response_projects.data.length);

        // Add default remote
        manifest['manifest'].push({
            remote: {
                _attr: {
                    name: response_remote.name,
                    fetch: response_projects.data[0].owner.html_url
                }
            }
        });

        // Add projects
        response_projects.data.forEach(repo => {
            manifest['manifest'].push({
                project: {
                    _attr: {
                        name: repo.name,
                        path: repo.name,
                        remote: response_remote.name
                    }
                }
            })
        });

        return xml(manifest, true);
    }
}