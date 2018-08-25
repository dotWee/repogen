const inquirer = require('inquirer');
const helper = require('./helper');
const config = require('config');

module.exports = {

    getOrAskForOutputFile: async (options) => {
        if (options.outputFile) {
            return options.outputFile;
        }

        let fileName = config.get('outputFile');

        const questions = [{
            type: 'input',
            name: 'outputFile',
            message: 'Enter output filename:',
            default: fileName,
            validate: function (value) {
                if (helper.isString(value)) {
                    return true;
                } else {
                    return 'Please enter a output filename.';
                }
            }
        }];

        let answer = await inquirer.prompt(questions);
        fileName = answer.outputFile;
        return fileName;
    }
};