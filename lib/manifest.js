const inquirer = require('./inquirer');
const github = require('./provider/github');
const gitlab = require('./provider/gitlab');
const gitea = require('./provider/gitea');
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

        // Create manifest backbone
        let manifest = module.exports.getManifestBackbone();

        // Get remote name
        let remoteName;
        if (helper.isString(program.remoteName)) {
            remoteName = program.remoteName;
        } else {
            let answer = await inquirer.askRemoteName();
            remoteName = answer.remote;
        }

        // Find out where to get the projects data from
        let answer = await inquirer.askProjectsProvider();
        if (answer.provider === 'Gitea') {
            const requestUrl = await gitea.getUrl();
            console.log('url', requestUrl);

            const response = await gitea.getProjects(requestUrl);
                
            // Add default remote
            module.exports.addRemote(remoteName, requestUrl.origin, manifest);

            // Add projects
            response.forEach(repo => {
                module.exports.addProject(repo.full_name, repo.full_name, remoteName, manifest);
            });
        } else {
            // Get profile name
            let profileName;
            if (helper.isString(program.profileName)) {
                profileName = program.profileName;
            } else {
                let answer = await inquirer.askProfileName();
                profileName = answer.name;
            }
            console.log('Fetching data for profile %s', profileName);

            if (answer.provider === 'GitHub') {
                const response = await github.getProjects(profileName);
    
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
        }

        return xml(manifest, true);
    }
}