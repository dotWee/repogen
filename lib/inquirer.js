const inquirer = require('inquirer');

module.exports = {

  askProfileName: () => {
    const questions = [{
      type: 'input',
      name: 'name',
      message: 'Enter a profile name to fetch its projects:',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a profile name to fetch its projects.';
        }
      }
    }];
    return inquirer.prompt(questions);
  }
};