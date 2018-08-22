const inquirer = require('inquirer');

module.exports = {

  askRemoteName: () => {
    const questions = [{
      type: 'input',
      name: 'remote',
      message: 'Give the default remote a name:',
      default: 'origin',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a name for the default remote.';
        }
      }
    }];
    return inquirer.prompt(questions);
  },

  askProfileName: () => {
    const questions = [{
      type: 'input',
      name: 'name',
      message: 'Enter a profile name to fetch its projects:',
      default: 'dotwee',
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