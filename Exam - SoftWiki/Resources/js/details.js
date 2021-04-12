import { html } from '../node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const articleDetailsTemplate = (article, isOwner, onDelete) => html`
    <section id="details-page" class="content details">
        <h1>${article.title}</h1>
        <div class="details-content">
            <strong>Published in category ${article.category}</strong>
            <p>${article.content}</p>
    
            <div class="buttons">
                ${ isOwner ? 
                    html`
                        <a href="#" class="btn delete" @click=${onDelete}>Delete</a>
                        <a href=${`/edit/${article._id}`} class="btn edit">Edit</a>
                        <a href="/" class="btn edit">Back</a>` 
                    : 
                    html`
                        <a href="/" class="btn edit">Back</a>
                    `}
                
            </div>
        </div>
    </section>
`;

export async function details(ctx) {
    const articleId = ctx.params.id;
    const article = await api.getArticleById(articleId);

    const userId = sessionStorage.getItem('userId');
    const ownerId = article._ownerId;
    const isOwner = userId === ownerId;

    ctx.render(articleDetailsTemplate(article, isOwner, onDelete));
    ctx.setNavigation();

    async function onDelete(event) {
        event.preventDefault();

        const isConfirmed = confirm('Are you sure you want to delete this Article?');
        if (isConfirmed) {
            if (isOwner) {
                await api.deleteArticle(articleId);
            } else {
                alert('You must be logged-in and be the owner of this meme in order to delete it!');

                return false;
            }
        } else {
            return false;
        }

        ctx.page.redirect('/');
    }
}