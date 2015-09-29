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
  afterInstall: function(options) {
    var packages = [
    	{ 
    		name: 'ember-cli-ccm-shims',
    		target: 'ArtisTechMedia/ember-cli-ccm-shims.git#master'
    	},
    	{
        	name: 'ember-cli-soundmanager-shim',
        	target: '~0.0.1'
        }
      ];
    return this.addBowerPackagesToProject( packages );
  }  
};
