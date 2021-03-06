const fs = require('fs');

module.exports = {

    isString: (value) => {
        return value && Object.prototype.toString.call(value) === '[object String]';
    },

    writeFile: (content, file) => {
        fs.writeFile(file, content, (err) => {
            if (err) {
                throw err;
            } 
        });
    },

    getPackageVersion: () => {
        return JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
    }
};