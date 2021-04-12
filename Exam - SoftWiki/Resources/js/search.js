import { html } from '../node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const articlePreviewTemplate = (article) => html`
    <a class="article-preview" href=${'/details/' + article._id}>
        <article>
            <h3>Topic: <span>${article.title}</span></h3>
            <p>Category: <span>${article.category}</span></p>
        </article>
    </a>
`;

const searchTemplate = (articles, onSubmit, searchValue) => html`
    <section id="search-page" class="content">
        <h1>Search</h1>
        <form id="search-form" @submit=${onSubmit}>
            <p class="field search">
                <input type="text" placeholder="Search by article title" name="search" .value=${searchValue}>
            </p>
            <p class="field submit">
                <input class="btn submit" type="submit" value="Search">
            </p>
        </form>
        <div class="search-container">
            ${ articles.length === 0 ?
                html`
                    <h3 class="no-articles">No matching articles</h3>
                    `: 
                articles.map(articlePreviewTemplate) }
        </div>
    </section>
`;

export async function search(ctx) {
    let searchValue = '';
    
    const queryStringKeyValuePairs = ctx.querystring.split('=');
    if (queryStringKeyValuePairs.length > 1) {
        searchValue = queryStringKeyValuePairs[1];
    }

    const articles = searchValue === '' ? [] : await api.search(searchValue);
    ctx.render(searchTemplate(articles, onSubmit, searchValue));
    
    ctx.setNavigation();

    function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const searchValue = formData.get('search');

        ctx.page.redirect('/search?query=' + searchValue);
    }
}