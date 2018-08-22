const inquirer = require('./inquirer');
const github = require('./github');
const xml = require('xml');
const program = require('commander');
const helper = require('./helper');

module.exports = {
    test: () => {
        
    },

    addProject: (projectName, projectPath, remoteName, manifest) => {
        manifest['manifest'].push({
            project: {
                _attr: {
                    name: projectName,
                    path: projectPath,
                    remote: remoteName
                }
            }
        })
    },

    addRemote: (remoteName, fetchUrl, manifest) => {
        manifest['manifest'].push({
            remote: {
                _attr: {
                    name: remoteName,
                    fetch: fetchUrl
                }
            }
        });
    },

    buildManifest: async () => {

        // Get profile name
        let profileName;
        if (helper.isString(program.profileName)) {
            profileName = program.profileName;
        }
        else {
            let answer = await inquirer.askProfileName();
            profileName = answer.name;
        }
        console.log('Fetching data for profile %s', profileName);
        
        // Get remote name
        let remoteName;
        if (helper.isString(program.remoteName)) {
            remoteName = program.remoteName;
        }
        else {
            let answer = await inquirer.askRemoteName();
            remoteName = answer.name;
        }

        // Request projects data
        const githubResponse = await github.getGithubProjects(profileName);
        console.log('Found %s projects.', response_projects.length);

        // Add default remote
        addRemote(remoteName, githubResponse[0].owner.html_url);

        // Add projects
        response_projects.data.forEach(repo => {addProject(repo.name, repo.name, remoteName, manifest)});

        return xml(manifest, true);
    }
}