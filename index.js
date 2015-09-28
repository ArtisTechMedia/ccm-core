/* jshint node: true */
'use strict';

module.exports = {
  name: 'ccm-core',
  
  //
  // this hooked is called as part of the host build
  // process injecting functionality into the host's
  // ember-cli-build.js
  //
  // the bower components referenced here were added 
  // to the host's bower configuration (virtual bower.json)
  // by the ./blueprints/ccm-core/index.js module 
  // during the install of this addon
  //
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

    app.import( bd + '/ccm-audio-player-ui/audio-player.css');

  }
};
