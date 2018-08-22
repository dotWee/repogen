const octokit = require('@octokit/rest')();
const inquirer = require('./inquirer');

module.exports = {

  getInstance: () => {
    return octokit;
  },

  getGithubProjects: async (profileName) => {
    // Assume its an organization
    try {
      const projects = await octokit.repos.getForOrg({
        org: profileName
      });

      return projects.data;
    } catch (err) {
      if (err) {
        if (err.code == 404) {
          // Its not a organization... lets try as user
          const projects = await octokit.repos.getForUser({
            username: profileName
          });

          console.log('Found some projects!');
          return projects;
        } else throw err;
      }
    }
  }
};