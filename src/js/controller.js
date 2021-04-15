// import icons from '../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/ResultsView.js';
import paginationView from './views/paginationView.js';
import BookmarksView from './views/bookmarksView.js'
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // loading recipe
    const id = window.location.hash.slice(1);
    if (!id) return;
    resultsView.update(model.getSearchResultsPage());
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    const { recipe } = model.state;
    // Rendering recipe
    recipeView.render(model.state.recipe);
    BookmarksView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
}

const controlBookmark = function () {
  // 1. Add bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // 2.Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  BookmarksView.render(model.state.bookmarks);
}

const controlSearchResults = async function (query) {
  try {
    // 1. Get querry from the view 
    const query = searchView.getQuery();
    if (!query) return;
    // 2. Fetch data and store it in the state
    await model.loadSearchResults(query);
    // 3. Render results
    resultsView.renderSpinner();
    // WITHOUT PAGINATION resultsView.render(model.state.search.results);
    // with pagination
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
    console.log(model.state.recipe);

  } catch (err) {
    console.error(err);
  }
}

const controlPage = function (page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const loadBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}
// window.addEventListener('hashchange')

const controlRecipeUpload = async function (data) {
  try {
    await model.uploadRecipe(data);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage('Recipe has been added');
    setTimeout(function () {
      addRecipeView._toggleRecipeView();
      addRecipeView.renderForm();
    }, 2000);
    BookmarksView.render(model.state.bookmarks);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
  // console.log(data);
}

const init = function () {
  BookmarksView.addHandlerRender(loadBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandleClick(controlPage);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  addRecipeView.addHandlerUpload(controlRecipeUpload);
}
// asdasd

init();