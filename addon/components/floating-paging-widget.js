import Ember from 'ember';
import layout from '../templates/components/floating-paging-widget';
import PagingWidget from './paging-widget';

export default PagingWidget.extend({
  layout: layout,
  appEvents: Ember.inject.service(),

  shouldShow: function() {
    var show = this.get('showPrev') || this.get('showNext');
    Ember.run.next(this, show ? this.hookScript : this.unhookScript );
    return show;
  }.property('showPrev','showNext'),

  didInsertElement: function() {
    this.hookScript();
  },
  
  willDestroyElement: function() {
    this.unhookScript();
  },
  
  hookScript: function() {
    this.get('appEvents').triggerWhen('browser.script.run','scroll-watcher',this.element);
  },
  
  unhookScript: function() {
    this.get('appEvents').trigger('browser.script.detach','scroll-watcher',this.element);
  },
    
});
