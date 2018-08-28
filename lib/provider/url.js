const fetch = require('node-fetch');

module.exports = {

    getProjects: async (manifest, options) => {
        let requestUrl = new URL(options.url);
        if (options.url) {
            requestUrl.searchParams.append('token', options.access_token);
        }
        
        manifest.getRemoteInstance().fetch = requestUrl.origin;
        const response = await fetch(requestUrl.href);
        const data = await response.json();

        let projects = [];
        data.forEach(project => {
            projects.push({
                name: project.path_with_namespace,
                path: project.path_with_namespace,
                remote: manifest.remoteConfig.name
            });
        });

        return projects;
    }
};