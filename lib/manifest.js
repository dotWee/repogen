const inquirer = require('./inquirer');
const github = require('./provider/github');
const gitlab = require('./provider/gitlab');
const xml = require('xml');
const program = require('commander');
const helper = require('./helper');

module.exports = {
    getManifestBackbone: () => {
        return {
            manifest: []
        };
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
        });
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

    writeToFile: async (manifest) => {

        // Get output file
        let fileName;
        if (helper.isString(program.outputFile)) {
            fileName = program.outputFile;
        } else {
            let answer = await inquirer.askOutputFile();
            fileName = answer.outputFile;
        }
        console.log('Writing to %s', fileName);

        helper.xml_write(manifest, fileName);

    },

    buildManifest: async () => {

        // Get profile name
        let profileName;
        if (helper.isString(program.profileName)) {
            profileName = program.profileName;
        } else {
            let answer = await inquirer.askProfileName();
            profileName = answer.name;
        }
        console.log('Fetching data for profile %s', profileName);

        // Get remote name
        let remoteName;
        if (helper.isString(program.remoteName)) {
            remoteName = program.remoteName;
        } else {
            let answer = await inquirer.askRemoteName();
            remoteName = answer.remote;
        }

        // Create manifest backbone
        let manifest = module.exports.getManifestBackbone();

        // Find out where to get the projects data from
        let answer = await inquirer.askProjectsProvider();
        if (answer.provider === 'GitHub') {
            const response = await github.getGithubProjects(profileName);

            // Add default remote
            module.exports.addRemote(remoteName, response[0].owner.html_url, manifest);

            // Add projects
            response.forEach(repo => {
                module.exports.addProject(repo.name, repo.name, remoteName, manifest);
            });
        } else if (answer.provider === 'GitLab') {
            const response = await gitlab.getProjects(profileName);
            
            // Add default remote
            module.exports.addRemote(remoteName, response[0].owner.web_url, manifest);

            // Add projects
            response.forEach(repo => {
                module.exports.addProject(repo.name, repo.name, remoteName, manifest);
            });
        }

        return xml(manifest, true);
    }
}