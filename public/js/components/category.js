Vue.filter('category', (id, mapping) => {
  return mapping[id] || 'Unkown';
});

Vue.filter('fontIcon', categoryId => {
  const iconClass = 'las la-';
  const mappings = [
    {
      re: /vacation$/,
      icon: 'globe',
    },
    {
      re: /clothes$/,
      icon: 'tshirt',
    },
    {
      re: /food.groceries$/,
      icon: 'shopping-basket',
    },
    {
      re: /bars?$/,
      icon: 'glass-cheers',
    },
    {
      re: /coffee$/,
      icon: 'coffee',
    },
    {
      re: /alcohol/,
      icon: 'wine-bottle',
    },
    {
      re: /food/,
      icon: 'utensils',
    },
    {
      re: /flights$/,
      icon: 'plane-departure',
    },
    {
      re: /publictransport$/,
      icon: 'bus',
    },
    {
      re: /transport/,
      icon: 'taxi',
    },
    {
      re: /house.repairs/,
      icon: 'tools',
    },
    {
      re: /house.fitment/,
      icon: 'couch',
    },
    {
      re: /electronics/,
      icon: 'desktop',
    },
    {
      re: /shopping/,
      icon: 'shopping-cart',
    },
    {
      re: /incurences-fees$/,
      icon: 'file-invoice-dollar',
    },
    {
      re: /home.communications$/,
      icon: 'photo-video',
    },
    {
      re: /home/,
      icon: 'home',
    },
    {
      re: /entertainment/,
      icon: 'theater-masks',
    },
    {
      re: /food.bars$/,
      icon: 'glass-cheers',
    },
    {
      re: /salary|refund/,
      icon: 'coins',
    },
    {
      re: /withdrawals$/,
      icon: 'receipt',
    },
    {
      re: /healthcare$/,
      icon: 'first-aid',
    },
    {
      re: /pharmacy$/,
      icon: 'prescription-bottle',
    },
    {
      re: /wellness/,
      icon: 'spa',
    },
  ];

  const match = mappings.find(obj => categoryId.match(obj.re));
  if (match) {
    return `${iconClass}${match.icon}`;
  }
  // Fallback
  return `${iconClass}question-circle`;
});

Vue.component('category', {
  props: ['categoryId', 'mapping'],
  template: '#tpl-category',
});

Vue.component('category-icon', {
  props: ['categoryId', 'mapping', 'interactive'],
  template: '#tpl-category-icon',
});
