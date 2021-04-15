import icons from 'url:../../img/icons.svg';
import View from './View.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime'

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet';
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', function (e) {
            handler();
        });
    }

    _generateMarkup() {
        return this._data.map(recipe => {
            return this._generateMarupPreview(recipe);
        }).join('');

    }
    _generateMarupPreview(recipe) {
        const id = window.location.hash.slice(1);
        return `
        <li class="preview">
            <a class="preview__link ${recipe.id === id ? 'preview__link--active' : ''}" href="#${recipe.id} ">
        <figure class="preview__fig">
            <img src="${recipe.image}" alt="Test" />
            </figure >
    <div class="preview__data">
        <h4 class="preview__title">${recipe.title}</h4>
        <p class="preview__publisher">${recipe.publisher}</p>
        <div class="preview__user-generated">

        </div>
    </div>
            </a >
        </li > `
    }

}
export default new BookmarksView();