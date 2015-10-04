import Uploads from './uploads';
import serialize from '../serializers/query';
import TagUtils from '../lib/tags';

export default Uploads.extend({
  
  _munge: function(params) {
    params.dataview = 'default';
    if( params.reqtags ) {
      params.reqtags = TagUtils.create( { source: params.reqtags }).add('acappella').toString();
    } else {
      params.reqtags = 'acappella';
    }
    return params;
  },

  acappellas: function(params) {
    params = this._munge(params);
    params.f = 'json';
    return this.query(params).then( serialize('pell') );
  },

  count: function(params) {
    params = this._munge(params);
    return this._super(params);
  },

});
