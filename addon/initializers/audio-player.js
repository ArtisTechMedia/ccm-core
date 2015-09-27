/* global Ember  */

import soundManager from 'soundManager';

export function initialize() { 

  if( typeof document !== 'undefined' ) { // only client mode
    soundManager.setup({
      url: '/soundmanager/swf/',
      debugMode: false
    });
  }
}

export default {
  name: 'audio-player',
  initialize: initialize
};

