import icons from 'url:../../img/icons.svg';
import View from './View.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found';
    _message = '';

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
        <div class="preview__user-generated ${recipe.key ? '' : 'hidden'} ">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg >
        </div>
    </div>
            </a >
        </li > `
    }

}
export default new ResultsView();