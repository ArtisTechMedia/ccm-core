module.exports = {
  description: 'ccm-core build injections'

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
  normalizeEntityName: function() {},
  
  afterInstall: function(options) {
    return this.addBowerPackageToProject('soundmanager');
  }  
};
