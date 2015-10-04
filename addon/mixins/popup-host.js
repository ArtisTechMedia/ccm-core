import Ember from 'ember';

/*
  How to do popup called 'example'

  use this mixin in a route (only tested in route/application)

    // routes/application.js

    import PopupHost from 'ccm-core/mixins/popup-host';

    export default Ember.Route.extend( PopupHost, {
      ...
    });

  derive your popup components from modal-common:

    // components/example-popup.js

    import ModalCommon from './modal-common';

    export default ModalCommon.extend({
      modalName: 'example',

      prop1: '',
      prop2: '',

      ...
    });

  put an outlet in the template:

    // templates/application.hbs
    
    {{outlet "popup"}}

  create a template for your popup and use the modal-popup 
  component:

    // templates/components/example-popup.hbs

    {{#modal-popup showing=true title=yourTitle subTitle=yourSubtitle  }}
        ...example body here...
    {{/model}}

  you can't put a component into an outlet so you have to create a
  one line partial to host your component (the post-fix "-shim" required)

    // templates/example-shim.hbs

    {{example-popup}}

  To invoke use the 'popup' action and the 'h' helper to pass properties
  to your popup component:

    // templates/some-template.hbs

    {{action 'popup' 'example' h( prop1=value1 prop2=value1 ) }}

  To invoke from another component:

    this.sendAction('popup', 'example', { prop1: value1, prop2: value2 } )
    
*/
export default Ember.Mixin.create({
  appEvents: Ember.inject.service(),

  popupTemplateHost: 'application',
  popupTemplateOutlet: 'modal',

  _closeHooked: false,

  onPopupClosed: function() {
    this.disconnectOutlet( { outlet: 'modal', parentView: 'application' } );
    this.set('currentOpenModal',null);
  },

  openPopup: function(name,hash) {

    if( !this._closeHooked ) {
      this._closeHooked = true;
      this.get('appEvents').on('popup.closed', this, this.onPopupClosed);
    }

    this.render( name + '-shim', { 
      into: this.popupTemplateHost,
      outlet: this.popupTemplateOutlet,
     });
  
    this.set('currentOpenModal',name);
  
    if( typeof hash !== 'undefined' && Object.keys(hash).length > 0 ) {
        this.get('appEvents').triggerWhen( 'popup.properties.'+name, hash );
    }

  },

  actions: {
    popup: function( name, hash ) {
        if( this.get('currentOpenModal') ) {
          this.onPopupClosed();
          Ember.run.next(this,() => {
            this.openPopup(name,hash);
          });
        } else {
          this.openPopup(name,hash);
        }
      },
    }
});
