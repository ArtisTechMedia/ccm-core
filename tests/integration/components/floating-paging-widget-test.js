import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('floating-paging-widget', 'Integration | Component | floating paging widget', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{floating-paging-widget}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#floating-paging-widget}}
      template block text
    {{/floating-paging-widget}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
