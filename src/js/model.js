import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js'
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        cookingTime: recipe.cooking_time,
        image: recipe.image_url,
        publisher: recipe.publisher,
        servings: recipe.servings,
        sourceUrl: recipe.source_url,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    }
};


export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}?key=${KEY}`)
        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false;
        // console.log(state.recipe);

    } catch (err) {
        throw err;
    }
}

export const loadSearchResults = async function (query) {
    try {
        const data = await getJSON(`${API_URL}/?search=${query}&key=${KEY}`)
        state.search.query = query;
        const { recipes } = data.data;
        state.search.page = 1;
        state.search.results = recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image_url,
                publisher: recipe.publisher,
                ...(recipe.key && { key: recipe.key }),
            }

        });
    } catch (err) {
        throw err;
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    this.state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);

}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ingredient => {
        return ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings
    });
    state.recipe.servings = newServings;
}

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    state.recipe.bookmarked = true;
    setToLocalStorage();
};
export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(bookmark => {
        return bookmark.id === id;
    });
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
    setToLocalStorage();
};

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(elem => {
            return (elem[0].startsWith('ingredient') && elem[1] != '')
        }).map(ing => {
            const ingArr = ing[1].replaceAll(' ', '').split(',');
            if (ingArr.length != 3) throw new Error('wrong ingredients format');
            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description };
        });
        console.log('ingredients: ', ingredients);
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.image,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients: ingredients,
        };
        const res = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(res);
        addBookmark(state.recipe);
        console.log('state.recipe: ', state.recipe);
    } catch (err) {
        throw (err);
    }


}

const setToLocalStorage = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

const loadFromLocalStorage = function () {

    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}
loadFromLocalStorage();

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
}