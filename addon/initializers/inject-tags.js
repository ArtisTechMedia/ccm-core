import Tags from '../services/tags';

export default {
  name: 'inject-tags',

  initialize: function(app) {

    var TAGS_SERVICE = 'service:tags';

    app.register( TAGS_SERVICE, Tags );

    app.inject('controller', 'tags', TAGS_SERVICE);    
    app.inject('route',      'tags', TAGS_SERVICE);
  }
};