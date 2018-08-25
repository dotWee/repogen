const config = require('config');
const xml = require('xml');

module.exports = class Manifest {

    constructor() {
        this.xmlRoot = {
            manifest: []
        };

        this.remoteConfig = config.get('_remote');
        this.defaultConfig = config.get('_default');
    }

    getRemoteInstance() {
        return this.xmlRoot['manifest'][0];
    }

    addDefault(defaultObj) {
        let attributes = {};

        Object.keys(defaultObj).forEach(key => {
            attributes[key] = defaultObj[key];
        });

        this.xmlRoot['manifest'].push({
            default: {
                _attr: attributes
            }
        });
    }

    addRemote(remoteObj) {
        let attributes = {};

        Object.keys(remoteObj).forEach(key => {
            attributes[key] = remoteObj[key];
        });

        this.xmlRoot['manifest'].push({
            remote: {
                _attr: attributes
            }
        });
    }

    addProjects(projectObjs) {
        projectObjs.forEach(project => {
            this.addProject(project);
        });
    }

    addProject(projectObj) {
        let attributes = {};

        Object.keys(projectObj).forEach(key => {
            attributes[key] = projectObj[key];
        });

        this.xmlRoot['manifest'].push({
            project: {
                _attr: projectObj
            }
        });
    }

    toXml() {
        if (this.remoteConfig) {
            this.addRemote(this.remoteConfig);
        }

        if (this.defaultConfig) {
            this.addDefault(this.defaultConfig);
        } 

        return xml(this.xmlRoot, true);
    }
};
