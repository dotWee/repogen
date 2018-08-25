const octokit = require('@octokit/rest')();

module.exports = {

    getProjects: async (manifest, options) => {
        let projects = [];

        // Assume its an organization
        try {
            let response = await octokit.repos.getForOrg({
                org: options.profile
            });

            response.data.forEach(project => {
                projects.push(
                    {
                        name: project.name,
                        path: project.name,
                        remote: manifest.getRemoteInstance().name
                    }
                );
            });
            manifest.getRemoteInstance().fetch = response.data[0].owner.html_url;

            return projects;
        } catch (err) {
            if (err) {
                if (err.code == 404) {
                    // Its not a organization... lets try as user
                    let response = await octokit.repos.getForUser({
                        username: options.profile
                    });

                    response.data.forEach(project => {
                        projects.push(
                            {
                                name: project.name,
                                path: project.name,
                                remote: manifest.getRemoteInstance().name
                            }
                        );
                    });
                    manifest.getRemoteInstance().fetch = response.data[0].owner.html_url;
                    return projects;
                } else throw err;
            }
        }
    }
};