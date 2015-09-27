/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

     /** soundManager **/
  
    app.import({
            development: 'bower_components/soundmanager/swf/soundmanager2_debug.swf',
            production: 'bower_components/soundmanager/swf/soundmanager2.swf'
        });
    app.import({
            development: 'bower_components/soundmanager/script/soundmanager2.js',
            production: 'bower_components/soundmanager/script/soundmanager2-nodebug-jsmin.js'
        });
    app.import('bower_components/ember-cli-soundmanager-shim/soundmanager2-shim.js', {
            exports: {
              soundManager: ['default']
            }
        });


  return app.toTree();
};
