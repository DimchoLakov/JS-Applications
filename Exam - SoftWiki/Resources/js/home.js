import { html } from '../node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const articleTemplate = (article) => html`
    <article>
        <h3>${article.title}</h3>
        <p>${article.content}</p>
        <a href=${`/details/${article._id}`} class="btn details-btn">Details</a>
    </article>
`;

const homeTemplate = (jsArticles, cSharpArticles, javaArticles, pythonArticles) => html`
    <section id="home-page" class="content">
        <h1>Recent Articles</h1>
        <section class="recent js">
            <h2>JavaScript</h2>
            ${ jsArticles.length === 0 ? 
                html`<h3 class="no-articles">No articles yet</h3>` :
                jsArticles.map(articleTemplate) }
        </section>
        <section class="recent csharp">
            <h2>C#</h2>
            ${ cSharpArticles.length === 0 ? 
                html`<h3 class="no-articles">No articles yet</h3>` :
                cSharpArticles.map(articleTemplate) }
        </section>
        <section class="recent java">
            <h2>Java</h2>
            ${ javaArticles.length === 0 ? 
                html`<h3 class="no-articles">No articles yet</h3>` :
                javaArticles.map(articleTemplate) }
        </section>
        <section class="recent python">
            <h2>Python</h2>
            ${ pythonArticles.length === 0 ? 
                html`<h3 class="no-articles">No articles yet</h3>` :
                pythonArticles.map(articleTemplate) }
        </section>
    </section>
`;

export async function home(ctx) {

    const articles = await api.getMostRecentArticles();
    const jsArticles = articles.filter(a => a.category.toLowerCase() === 'JavaScript'.toLowerCase());
    const cSharpArticles = articles.filter(a => a.category.toLowerCase() === 'C#'.toLowerCase());
    const javaArticles = articles.filter(a => a.category.toLowerCase() === 'Java'.toLowerCase());
    const pythonArticles = articles.filter(a => a.category.toLowerCase() === 'Python'.toLowerCase());
    
    ctx.render(homeTemplate(jsArticles, cSharpArticles, javaArticles, pythonArticles));
    ctx.setNavigation();
}