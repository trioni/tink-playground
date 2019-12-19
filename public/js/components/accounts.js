Vue.component('accounts', {
  props: ['entities'],
  template: '#tpl-accounts',
  data: () => ({
    sensitive: window.$sensitive,
  }),
});
