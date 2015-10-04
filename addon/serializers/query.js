/* globals Ember */
import TagUtils from '../lib/tags';
import LicenseUtils from '../lib/licenses';

/**
  Module exists to normalize the wild & crazy results from the query API.
  
  For all models there are some consistent naming (if not always present - sigh):
  
  use .name for printable name
  use .id for Ember model identifying

  This is why for Tag the .id and .name both map to tags_tag
  
  use 'url' for pages that point to ccMixter
  (Except Trackback - the url property points at the original website.)
  
  So all models that represent uploads/media (Upload, Remix, Trackback) have the
  same properties. 
  
  Access properties related to the artist through the artist object on the upload:
  
     upload.name     -> upload_name
     upload.url      -> file_page_url
     upload.artist.name  -> user_real_name
     upload.artist.url   -> artist_page_url
     upload.artist.id  -> user_name
  
  for UploadDetail there is additionally remixes, sources and trackbacks (added 
  in the store)
  
    upload.remixes[0].name
    upload.remixes[0].artist.name
    
    upload.trackbacks[0].name
  
  The audio player will add a .media object that needs to have a .name, .artist.name and 
  .artist.id for the player to display. These are added below in a callback from 
  the player.
  
*/

var Model = Ember.Object.extend({
});

 
var File = Model.extend({

  urlBinding:      'download_url',
  idBinding:       'file_id',
  sizeBinding:     'file_filesize',
  typeBinding:     'file_extra.type',

  nicName: function() {
    if( this.get('file_nicname') !== this.get('extension') ) {
      return this.get('file_nicname');
    }
  }.property('file_nicname'),

  tags: function() {
    if( 'ccud' in this.file_extra ) {
      return TagUtils.create( { source: this.file_extra.ccud });
    }
    return '';
  }.property('file_extra'),

  hasTag: function(tag) {
    var tags = this.get('tags');
    if( tags )
      return tags.contains(tag);
    return false;
  },

  isAudio: function() {
    var ffi = this.get('file_format_info');
    if( ffi && 'mime_type' in ffi ) {
      return ffi['mime_type'].match(/^audio\//);
    }
    return false;
  }.property('file_format_info'),

  isMP3: function() {
    var ffi = this.get('file_format_info');
    if( ffi && 'format-name' in ffi ) {
      return ffi['format-name'] === 'audio-mp3-mp3'
    }
    return false;
  }.property('file_format_info'),

  extension: function() {
    return this.get('local_path').replace(/.*\.([a-z0-9]+)$/,'$1');
  }.property('file_name'),
  
});

var UploadUserBasic = Model.extend( {
  nameBinding: '_bindParent.user_real_name',
});

var UploadBasic = Model.extend( {

  nameBinding: 'upload_name',
  urlBinding:  'file_page_url',
  idBinding:   'upload_id',
  
  _modelSubtree: {
    artist: UploadUserBasic,
  },

});

var Remix  = UploadBasic.extend();
var Source = UploadBasic.extend();

var TrackbackUser = Model.extend({
  nameBinding: '_bindParent.pool_item_artist',
});

var Trackback = Model.extend( {

  _modelSubtree: {
    artist: TrackbackUser,
  },

  name: function() {
    var name = this.get('pool_item_name') + '';
    if( name.match(/^watch\?/) !== null ) {
      name = 'You Tube Video';
    }
    return name;
  }.property('pool_item_name'),
  
  urlBinding:   'pool_item_url',
  embedBinding: 'pool_item_extra.embed',
  typeBinding:  'pool_item_extra.ttype',
  
});

var UploadUser = UploadUserBasic.extend({
  idBinding: '_bindParent.user_name',
});

var Upload = UploadBasic.extend({

  _modelSubtree: {
    files: File,
    artist: UploadUser,
  },

  idBinding: 'upload_id',
  
  bpm: function() {
    var bpm = this.get('upload_extra.bpm');
    if(  (bpm + "").match(/[^0-9]/) === null ) {
      return bpm;
    }
  }.property('upload_extra.bpm'),

  fileInfo: function() {
    return this.get('files').findBy('isAudio');
  }.property('files'),

  wavImageURL: function() {
    var fi = this.get('fileInfo');
    if( fi ) {
      var baseURL = 'http://ccmixter.org/waveimage/'; // um, hello ENV?
      return baseURL + this.get('id') + '/' + fi.get('id');
    }
    return null;
  }.property('fileInfo'),

  /* required by audio player */
  mediaURL: function() {
    return this.get('fileInfo.download_url') || this.get('fplay_url') || this.get('download_url');
  }.property('files'),
  
  mediaTags: function() {

    /* required by audio player */
    var id          = this.get('id');
    var name        = this.get('name');

    /* app wants this stuff */
    var fi          = this.get('fileInfo');
    var fileID      = fi.file_id || 0;
    var wavImageURL = this.get('wavImageURL');
    var artist      = {
                   name: this.get('artist.name'),
                   id: this.get('artist.id'),
                 };

    return { name, id, fileID, artist, wavImageURL };

  }.property('fileInfo', 'artist'),

});

var ACappellaFile = File.extend({
  isPlayablePell: function() {
    return this.get('isAudio') && this.hasTag('acappella');
  }.property('file_format_info'),

});

var ACappella = Upload.extend( {

  _modelSubtree: {
    files: ACappellaFile,
    artist: UploadUser,
  },

  fileInfo: function() {
    var pellFile = this.get('files').findBy('isPlayablePell');
    if( !pellFile ) {
      return this.get('files').findBy('isAudio');
    }
    return pellFile;
  }.property('files'),

});

var UserBasic = Model.extend( {
  nameBinding: 'user_real_name',
  idBinding:   'user_name',
});

var User = UserBasic.extend( {
  avatarURLBinding: 'user_avatar_url',

  url: function() {
    return this.get('artist_page_url') + '/profile';
  }.property('artist_page_url'),
  
  homepage: function() {
    if( this.get('user_homepage') === this.get('artist_page_url') ) {
      return null;
    }
    return this.get('user_homepage');
  }.property('user_homepage','artist_page_url'),
});

var DetailUser = UploadUser.extend( {
  avatarURLBinding: '_bindParent.user_avatar_url',
});

var Detail = Upload.extend( {

  _modelSubtree: {
    files: File,
    artist: DetailUser,
  },

  tags: function() {
    return TagUtils.create( { source: this.get('upload_tags') } );
  }.property('upload_tags'),
  
  userTags: function() {
    return TagUtils.create( { source: this.get('upload_extra.usertags') } );
  }.property('upload_extra'),
  
  hasTag: function(tag) {
    return this.get('tags').contains(tag);
  },

  featuring: function() {
    var feat = this.get('upload_extra.featuring');
    if( !feat && this.get('sources') ) {
      var unique = [ ];
      // hello O(n)
      this.get('sources').forEach( f => {
        var name = f.get('artist.name');
        if( !unique.contains(name) ) {
          unique.push(name);
        }
      });
      feat = unique.join(', ');
    }  
    return feat;
  }.property('upload_extra.featuring','remixes'),
  
  // License stuff 
  
  licenseNameBinding: 'license_name',
  licenseURLBinding: 'license_url',
  
  isCCPlus: function() {
    return this.hasTag('ccplus');
  }.property('upload_tags'),

  isOpen: function() {
    return this.hasTag('attribution,cczero');
  }.property('upload_tags'),
  
  licenseLogoURL: function() {
    return LicenseUtils.logoURLFromName( this.get('license_name') );
  }.property('license_name'),
  
  licenseYear: function() {
    return this.get('year') || (this.get('upload_date') || this.get('upload_date_format')).match(/(19|20)[0-9]{2}/)[0];
  }.property(),
  
  purchaseLicenseURL: function() {
    if( this.get('isCCPlus') ) {
      var baseURL = 'http://tunetrack.net/license/';
      return baseURL + this.get('file_page_url').replace('http://', '');
    }
  }.property('file_page_url','isCCPlus'),

  purchaseLogoURL: function() {
    if( this.get('isCCPlus') ) {
      return LicenseUtils.logoURLFromAbbr( 'ccplus' );
    }
  }.property('isCCPlus'),
  
});

var Tag = Model.extend( {
  idBinding:    'tags_tag',
  nameBinding:  'tags_tag',
  countBinding: 'tags_count'
});

var Topic = Model.extend({
  publishedBinding: 'topic_date',
  idBinding:        'topic_id',
  nameBinding:      'topic_name',
  rawBinding:       'topic_text',
  htmlBinding:      'topic_text_html',
  textBinding:      'topic_text_plain',
});


function _bindToParent(parent,prop) {
  if( Ember.isArray(prop) ) {
    prop.forEach( o => _bindToParent(parent,o) );
  }
  prop.set('_bindParent',parent);
}

function _serialize(initValues,model) {

  if( Ember.isArray(initValues) ) {
    return initValues.map( o => _serialize(o,model) );
  }

  var obj = model.create(initValues);

  var subTreeModels = model.proto()._modelSubtree || null;
  if( subTreeModels ) {
    for( var propName in subTreeModels ) {
      var value = _serialize( initValues[propName] || {}, subTreeModels[propName] );
      obj.set( propName, value );
      _bindToParent( obj, value );
    }
  }

  return obj;
}

var models = {
  remix:     Remix,
  trackback: Trackback,
  detail:    Detail,
  upload:    Upload,
  user:      User,
  tag:       Tag,
  userBasic: UserBasic,
  source:    Source,
  topic:     Topic,
  pell:      ACappella,
};

/**
  serialize omnibus function can be called in two ways:
  
  serialize( 'modelname' )
  
    - this returns a function that takes a single argument 
      (perfect for .then() !) that will serialize the incoming
      result(s) in the model specified. If the incoming
      result is an array, each result will be serialized 
      in place.
      
  serialize( objectToSerialize, 'modelname' ) 
  
    - This will perform the serialization immediately
      on the first parameter. If that object is an
      array, it will serialize each item in place
      and return the array.
      
**/
export default function serialize(param,model) {
  if( typeof(model) === 'undefined' ) {
    return result => _serialize(result,models[param]);
  }
  return _serialize(param,models[model]);
}

