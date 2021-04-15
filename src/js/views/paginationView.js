import icons from 'url:../../img/icons.svg';
import View from './View.js';
import { API_URL, RES_PER_PAGE } from '../config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime'

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandleClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            e.preventDefault();
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = Number(e.target.closest('.btn--inline').dataset.goto);

            handler(goToPage);
        })
    }

    _btnLeftMarkup(currPage) {
        return `
            <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
                <span>${currPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
    }
    _btnRightMarkup(currPage) {
        return `
            <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>${currPage - 1}</span>
            </button>
            `
    }
    _generateMarkup() {
        const numpages = Math.ceil(this._data.results.length / RES_PER_PAGE);
        const currPage = Number(this._data.page);

        // 1. 1 page and there are more
        if (numpages > 1 && currPage === 1) {
            return this._btnLeftMarkup(currPage);
        }
        // 2. last page and there are more then 1
        if (numpages > 1 && currPage === numpages) {
            return this._btnRightMarkup(currPage);
        }
        // 3. page in the middle (more then one)
        if (numpages > 1 && currPage < numpages && currPage > 1) {
            return this._btnLeftMarkup(currPage) +
                this._btnRightMarkup(currPage);
        }
        // 4. 1 of 1 page
        if (numpages === 1) return "";
    }

}

export default new PaginationView();