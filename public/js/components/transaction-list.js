Vue.component('transaction-list', {
  props: ['transactions', 'mapping', 'interactive', 'onCategory'],
  template: '#tpl-transaction-list',
  methods: {
    handleCategoryChange: function(event) {
      if (this.interactive && this.onCategory) {
        this.onCategory(event);
      }
    },
  },
});
