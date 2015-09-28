/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // this files is only for the dummy test app and has nothing to
  // do with the add-on or the hosting/target app
  
  return app.toTree();
};
