import Ember from 'ember';
import PopupHostMixin from '../../../mixins/popup-host';
import { module, test } from 'qunit';

module('Unit | Mixin | popup host');

// Replace this with your real tests.
test('it works', function(assert) {
  var PopupHostObject = Ember.Object.extend(PopupHostMixin);
  var subject = PopupHostObject.create();
  assert.ok(subject);
});
