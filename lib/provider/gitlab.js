const Gitlab = require('gitlab/dist/es5').default;

module.exports = {
    
    getProjects: async (manifest, options) => {

        const service = new Gitlab({
            url: options.url,
            token: options.token
        });

        const response = await service.Users.projects(options.profile);
        let projects = [];

        response.forEach(project => {
            projects.push({
                name: project.name,
                path: project.name,
                remote: manifest.remoteConfig.name
            });
        });
        
        manifest.getRemoteInstance().fetch = response[0].owner.web_url;
        return projects;
    }
};