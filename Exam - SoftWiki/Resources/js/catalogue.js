import { html } from '../node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const articlePreviewTemplate = (article) => html`
    <a class="article-preview" href=${`/details/${article._id}`}>
        <article>
            <h3>Topic: <span>${article.title}</span></h3>
            <p>Category: <span>${article.category}</span></p>
        </article>
    </a>
`;

const catalogueTemplate = (articles) => html`
    <section id="catalog-page" class="content catalogue">
        <h1>All Articles</h1>
        ${ articles.length === 0 ?
            html`<h3 class="no-articles">No articles yet</h3>` :
            articles.map(articlePreviewTemplate) }
    </section>
`;

export async function catalogue(ctx) {
    const articles = await api.getAllArticles();

    ctx.render(catalogueTemplate(articles));
}