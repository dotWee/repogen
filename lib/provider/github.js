const octokit = require('@octokit/rest')();

module.exports = {

    getProjects: async (profileName) => {
        let response;

        // Assume its an organization
        try {
            response = await octokit.repos.getForOrg({
                org: profileName
            });

            const projects = response.data;
            return projects;
        } catch (err) {
            if (err) {
                if (err.code == 404) {
                    // Its not a organization... lets try as user
                    response = await octokit.repos.getForUser({
                        username: profileName
                    });

                    const projects = response.data;
                    return projects;
                } else throw err;
            }
        }
    }
};