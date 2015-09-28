module.exports = {
  description: 'ccm-core build injections'

  normalizeEntityName: function() {},
  
  afterInstall: function(options) {
    var packages = [
        'soundmanager',
        'ccm-audio-player-ui'
      ];
    return this.addBowerPackagesToProject( packages );
  }  
};
