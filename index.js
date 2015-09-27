/* jshint node: true */
'use strict';

module.exports = {
  name: 'ccm-core',
  
  included: function(app) {
    this._super.included(app);

    var bd = app.bowerDirectory;
    
    app.import({
            development: bd + '/soundmanager/swf/soundmanager2_debug.swf',
            production: bd + '/soundmanager/swf/soundmanager2.swf'
        });
    app.import({
            development: bd + '/soundmanager/script/soundmanager2.js',
            production: bd + '/soundmanager/script/soundmanager2-nodebug-jsmin.js'
        });
    app.import( bd + '/ember-cli-soundmanager-shim/soundmanager2-shim.js', {
            exports: {
              soundManager: ['default']
            }
        });
  }
};
