import {
  UPDATE_PAGE,
  SET_PAGE_TITLE,
  SET_PAGES
} from '../actions/app.js';

const INITIAL_STATE = {
  page: {
    title: 'Loading...',
    id: 'NO_ID'
  },
  pages: []
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      let updatedPage;
      const pages = state.pages.map(page => {
        if(page.id === action.pageId) {
          updatedPage = {
            ...page,
            params: action.params
          };
          return updatedPage;
        } else {
          return page
        }
      });
      return {
        ...state,
        page: updatedPage,
        pages
      };
    case SET_PAGES:
      return {
        ...state,
        pages: action.pages
      };
    case SET_PAGE_TITLE:
      return {
        ...state
      }
    default:
      return state;
  }
};

export default app;
