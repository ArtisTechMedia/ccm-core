/* jshint node: true */
'use strict';

/*
  Yea, so about this...

  The SoundManager js file throws an exception right at the start
  if window.document isn't defined.

  For the FastBoot case we just need the definition so the page
  will generate on the server. 

  So we suck in the file, wrap it in the code below and feed
  that to the rest of the build process.

*/
var fs = require('fs');

var sm2WrapHead = 
  "(function (window,_undefined) {\n\n" +

  "  if( typeof FastBoot !== 'undefined')\n" +
  "  {\n" +
  "    window.SoundManager = {};\n" +
  "    window.soundManager = {};\n" +
  "    return;\n" +
  "  }\n\n";

var sm2WrapFoot = "\n\n}(window));\n";

function fastBootSafeSM2(path)
{
  var contents = fs.readFileSync(path);
  contents = sm2WrapHead + contents + sm2WrapFoot;
  path = 'vendor/' + path.replace(/\//g,'_');
  fs.writeFileSync(path,contents);
  return path;
}

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
            development: fastBootSafeSM2(bd + '/soundmanager/script/soundmanager2.js'),
            production: fastBootSafeSM2(bd + '/soundmanager/script/soundmanager2-nodebug-jsmin.js'),
        });
    app.import( bd + '/ember-cli-soundmanager-shim/soundmanager2-shim.js', {
            exports: {
              soundManager: ['default']
            }
        });

  //
  // see ccm-core/blueprints/ccm-core/index.js for why this 
  // doesn't work here
  //
  //  app.import( bd + '/ember-cli-ccm-shims/audio-player.css');

  }
};
