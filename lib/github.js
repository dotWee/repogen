const octokit = require('@octokit/rest')();
const inquirer = require('./inquirer');

module.exports = {

  getInstance: () => {
    return octokit;
  },

  getGithubProjects: async () => {
    const name = await inquirer.askProfileName();
    console.log('Trying to get projects of profile %s...', name.name);

    // Assume its an organization
    try {
      const projects = await octokit.repos.getForOrg({
        org: name.name
      });

      return projects;
    } catch (err) {
      if (err) {
        if (err.code == 404) {
          // Its not a organization... lets try as user
          const projects = await octokit.repos.getForUser({
            username: name.name
          });

          console.log('Found some projects!');
          return projects;
        } else throw err;
      }
    }
  }
};