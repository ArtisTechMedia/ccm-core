module.exports = {
  description: 'ccm-core dependency injections',

  normalizeEntityName: function() {},
  
  // what it says on the tin: this will
  // be called once after the install of
  // the addon in the host/target's 
  // project
  //
  // these packages are then referred to
  // by our index.js in the root of this
  // project which is the entry point
  // during a build of the hosting app
  //
  // N.B. I'm not sure about this but I 
  // think you MUST run:
  //
  //    ember install ember-cli-ccm-core
  //
  // to have this blueprint run even if
  // it referred to in the packages.json
  // of the hosting app
  //
  afterInstall: function(options) {
    var packages = [
      {
          name: 'bootstrap',
          target: '~3.3.5'
      },
      {
        name: 'font-awesome',
        target: '~4.4.0'
      },
    	{
        	name: 'ember-cli-soundmanager-shim',
        	target: '~0.0.1'
      }
    ];
    return this.addBowerPackagesToProject( packages );
  }  
};
