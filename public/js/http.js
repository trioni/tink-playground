const Http = window.Http || {};
(function(ns) {
  async function parseResponse(res) {
    if (res.ok) {
      return res.json();
    }

    if (res.status === 401) {
      window.location = '/';
    }
    const contentType = res.headers.get('content-type');
    let errorJson = { error: 'Error calling api' };
    if (contentType.indexOf('application/json') > -1) {
      errorJson = await res.json();
    }
    throw new Error(errorJson.error);
  }

  function fetchSearchResults(values) {
    return fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then(parseResponse);
  }

  function fetchEndpoint(endpoint, init) {
    return fetch(`/api/proxy${endpoint}`, {
      credentials: 'include',
      ...init,
    }).then(parseResponse);
  }

  const sortBy = key => (a, b) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }

    // names must be equal
    return 0;
  };

  function sortCategories(categories) {
    return categories.sort(sortBy('sortOrder'));
  }

  function toOption(category) {
    return {
      value: category.id,
      label: category.secondaryName || category.primaryName,
    };
  }

  function toOptions(categories) {
    return categories.map(c => toOption(c));
  }

  function fetchCategories() {
    return fetchEndpoint('/categories')
      .then(sortCategories)
      .then(categories => {
        // Remove the root level categories like:
        // - income, expense and transfers
        const filteredCategories = categories
          .filter(c => c.parent !== null)
          .filter(c => !c.defaultChild);
        const categoryOptions = toOptions(filteredCategories);

        const categoryMap = categories.reduce((acc, obj, v) => {
          acc[obj.id] = obj.code;
          return acc;
        }, {});
        return [categoryOptions, categoryMap];
      });
  }

  function fetchIdentities() {
    return fetchEndpoint('/identitied');
  }

  function fetchStatistics() {
    return fetchEndpoint('/statistics/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resolution: 'WEEKLY',
        types: ['expenses-by-category'],
      }),
    }).then(jsonResult => ({ statistics: jsonResult }));
  }

  function fetchSimilar(id) {
    return fetchEndpoint(`/transactions/${id}/similar`);
  }

  ns.fetchEndpoint = fetchEndpoint;
  ns.fetchSimilar = fetchSimilar;
  ns.fetchStatistics = fetchStatistics;
  ns.fetchCategories = fetchCategories;
  ns.fetchSearchResults = fetchSearchResults;
})(Http);
