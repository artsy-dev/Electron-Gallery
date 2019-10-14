export const UPDATE_PAGE = 'UPDATE_PAGE';
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const SET_PAGES = 'SET_PAGES';

export const navigate = (page) => (dispatch) => {
  import(page.script);

  dispatch({
    type: UPDATE_PAGE,
    pageId: page.id,
    params: page.params,
    searchParams: page.searchParams
  });

  if(page.autoTitle) {
    dispatch(setPageTitle(page.id, page.title));
  }
};

export const setPageTitle = (pageId, title) => ({
  type: SET_PAGE_TITLE,
  title,
  pageId
});

export const setPages = (pages) => ({
  type: SET_PAGES,
  pages
})