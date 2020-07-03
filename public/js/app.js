function getNumberLocale() {
  return Intl.NumberFormat().resolvedOptions().locale;
}

function getDateLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale;
}

function getFirstDateOfCurrentYear() {
  return `${new Date().getFullYear()}-01-01`;
}

function getDefaultQueryObject() {
  return {
    startDate: getFirstDateOfCurrentYear(),
    offset: 0,
  };
}

function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

Vue.filter('json', value => {
  return JSON.stringify(value, null, 2);
});

Vue.filter('percent', (value, decimals = 2) => {
  let adjustedValue = value;
  if (1 > adjustedValue) {
    adjustedValue = value * 100;
  }
  return `${adjustedValue.toFixed(decimals)}%`;
});

Vue.filter('amount', value => {
  const v = value || 0;
  const roundedValue = Math.round(v * 100) / 100;
  return roundedValue;
});

Vue.filter('currency', (value, currency) => {
  return new Intl.NumberFormat(getNumberLocale(), {
    style: 'currency',
    currency: currency || window.$currency || 'SEK',
  }).format(value);
});

Vue.filter('sensitive', (value, min, max) => {
  if (window.$sensitive) {
    return getRandomBetween(min || 0, max || 10000);
  }
  return value;
});

Vue.filter('round', (value, decimals = 2) => {
  return value.toFixed(decimals);
});

Vue.filter('toDate', timestamp => {
  const d = new Date(timestamp);
  return Intl.DateTimeFormat(getDateLocale()).format(d);
});

Vue.filter('daysAgo', dateString => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const now = new Date();
  const startDate = new Date(dateString);
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.ceil(diffTime / MS_PER_DAY);
  return diffDays;
});

async function start() {
  const qs = new URLSearchParams(location.search);

  const router = new VueRouter({
    mode: 'history',
  });

  const app = new Vue({
    router,
    el: '#root',
    mounted: async function() {
      const [options, categoryMap] = await Http.fetchCategories();
      this.categoryOptions = options;
      this.categoryMap = categoryMap;

      try {
        const user = await Http.fetchEndpoint('/user');
        window.$currency = user.profile.currency;
      } catch (err) {
        this.error = 'Could not get user. Currency could not be determined';
      }

      this.handleSubmit();
    },
    data: {
      form: {
        queryString: qs.get('queryString') || '',
        startDate: qs.get('startDate') || '',
        category: qs.get('category') || '',
        offset: qs.get('offset') || 0,
      },
      categoryOptions: [],
      categoryMap: {},
      isSubmitting: true,
      error: undefined,
      sum: 0,
      response: {},
      similarTransactions: [],
      secondaryData: {},
      secondaryType: '',
      isLoadingSecondary: false,
      isDrawerOpen: false,
      numPages: 0,
      currentQuery: '',
      isPaginationOpen: false,
      $sensitive: window.$sensitive,
      isSidebarOpen: true,
    },
    methods: {
      handleToggleSensitive: function() {
        window.$sensitive = !window.$sensitive;
        this.$data.$sensitive = window.$sensitive;
      },
      handleToggleSidebar: function() {
        this.$data.isSidebarOpen = !this.$data.isSidebarOpen;
      },
      updateQuery: function(obj, reset = false) {
        const nextQuery = {
          ...(!reset && { ...this.$route.query }),
          ...obj,
        };
        const next = JSON.stringify(nextQuery);
        const current = JSON.stringify(this.$router.history.current.query);
        if (next === current) {
          return;
        }
        this.$router.push({
          query: nextQuery,
        });
      },
      onChangeCategory: function(categoryId) {
        this.updateQuery({ category: categoryId, offset: 0 });
      },
      searchAPI: async function(values) {
        const PAGE_SIZE = 100;
        const { metrics, ...rest } = await Http.fetchSearchResults(values);
        this.sum = metrics.SUM;
        this.numPages = Math.ceil(rest.count / PAGE_SIZE);
        this.response = rest;
        this.isPaginationOpen = false;
      },
      handleFetch: async function(e) {
        try {
          this.isLoadingSecondary = true;
          const endpoint = e.currentTarget.value;
          const res = await Http.fetchEndpoint(endpoint);
          this.secondaryData = res;
          this.secondaryType = endpoint;
        } catch (err) {
          this.error = err.message;
        } finally {
          this.isLoadingSecondary = false;
        }
      },
      handleTogglePagination: function() {
        this.isPaginationOpen = !this.isPaginationOpen;
      },
      searchSimilar: async function(id) {
        try {
          const res = await Http.fetchSimilar(id);
          this.similarTransactions = res.transactions;
        } catch (err) {
          this.error = err.message;
        }
      },
      handleFetchStatistics: async function() {
        try {
          const res = await Http.fetchStatistics();
          this.secondaryData = res;
          this.secondaryType = `/statistics/query`;
        } catch (err) {
          this.error = err.message;
        }
      },
      handleChange: function(e) {
        const { name, value } = e.target;
        console.log('Name: ', name);
        this.updateQuery({
          ...(name !== 'offset' && { offset: 0 }),
          [name]: value,
        });
      },
      handleSubmit: async function(e) {
        if (e) {
          e.preventDefault();
        }
        this.isSubmitting = true;
        this.error = undefined;
        try {
          await this.searchAPI({
            ...this.form,
            startDate: document.querySelector('input[type=date]').valueAsNumber,
          });
        } catch (err) {
          this.error = err.message;
        } finally {
          this.isSubmitting = false;
        }
      },
      handleReset: function(e) {
        if (e) {
          e.preventDefault();
        }
        this.updateQuery(getDefaultQueryObject(), true);
      },
      handleCloseDrawer: function() {
        this.similarTransactions = [];
      },
      handleCloseDebug: function() {
        this.secondaryData = {};
        this.secondaryType = '';
      },
      handleClearError: function() {
        this.error = undefined;
      },
    },
  });

  router.afterEach(to => {
    const { category, startDate, queryString, offset } = to.query;
    app.form = {
      category,
      startDate,
      queryString,
      offset,
    };
    app.handleSubmit();
  });

  app.$sensitive = true;

  if (!qs.get('startDate')) {
    router.push({ query: getDefaultQueryObject() });
  }
}
window.$currency = 'USD';
window.$sensitive = false;
start();
