import api from './api';

const searchService = {
  search: (params = {}) => {
    return api.get('/search', { params });
  },

  autocomplete: (query) => {
    return api.get('/search/autocomplete', { params: { q: query } });
  },

  topSearches: (limit = 20) => {
    return api.get('/admin/search/top', { params: { limit } });
  },
};

export default searchService;
