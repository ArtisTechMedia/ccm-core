/* jshint node: true */
'use strict';


/*
  Yea, so about this...

  The SoundManager js file throws an exception right at the start
  if window.document isn't defined.

  For the FastBoot case we just need the definition so the page
  will generate on the server. 

  Bootstrap.js does a bunch of DOM-y stuff which
  chokes in FastBoot mode.

  For the FastBoot case we just need the page to
  generate statically on the server.

  So we suck in the file, wrap it in the code below and feed
  that to the rest of the build process.

*/
var fs = require('fs');

var sm2WrapHead = 
  "\n// this wrapper was added during the ccm-core build injection\n\n" +
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

var bsWrapHead = "if( typeof FastBoot === 'undefined' ) \n { \n\n";
var bsWrapFoot = "\n\n}\n";

function fastBootSafeBS(path)
{
  var contents = fs.readFileSync(path);
  contents = bsWrapHead + contents + bsWrapFoot;
  path = 'vendor/' + path.replace(/\//g,'_');
  fs.writeFileSync(path,contents);
  return path;
}

module.exports = {
  name: 'ccm-core',
  
  treeForVendor: function() {
    var np = this.project.nodeModulesPath;
    return np + '/ember-cli-ccm-core/vendor';
  },
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
    
    /** sound manager **/

    app.import({
        development: bd + '/soundmanager/swf/soundmanager2_debug.swf',
        production: bd + '/soundmanager/swf/soundmanager2.swf'
      },
      {
        destDir: '/swf'
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

    /** bootstrap **/
    
    app.import(bd + '/bootstrap/dist/css/bootstrap.css');
    app.import(bd + '/bootstrap/dist/css/bootstrap-theme.css');
    app.import({
      development: fastBootSafeBS(bd + '/bootstrap/dist/js/bootstrap.js'),
      production:  fastBootSafeBS(bd + '/bootstrap/dist/js/bootstrap.min.js'),
    });

    /** font awesome **/

    app.import({
      development: bd + '/font-awesome/css/font-awesome.css',
      production:  bd + '/font-awesome/css/font-awesome.min.css'
    });

    var fonts = [
      "fontawesome-webfont.eot",
      "fontawesome-webfont.svg",
      "fontawesome-webfont.ttf",
      "fontawesome-webfont.woff",
      "fontawesome-webfont.woff2",
      "FontAwesome.otf"
    ];

    for (var i = fonts.length - 1; i >= 0; i--) {
      app.import( bd + '/font-awesome/fonts/' + fonts[i], {
        destDir: '/fonts',
        type:    'vendor',
        prepend:  false
      });
    };
    
    app.import( 'vendor/styles/audio-player.css' );

  }
};
