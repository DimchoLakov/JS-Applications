import { html } from '../node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const editArticleTemplate = (article, onSubmit) => html`
    <section id="edit-page" class="content">
        <h1>Edit Article</h1>
        <form id="edit" action="#" method="" @submit=${onSubmit}>
            <fieldset>
                <p class="field title">
                    <label for="title">Title:</label>
                    <input type="text" name="title" id="title" placeholder="Enter article title" .value=${article.title}>
                </p>
    
                <p class="field category">
                    <label for="category">Category:</label>
                    <input type="text" name="category" id="category" placeholder="Enter article category"
                        .value=${article.category}>
                </p>
                <p class="field">
                    <label for="content">Content:</label>
                    <textarea name="content" id="content" .value=${article.content}></textarea>
                </p>
    
                <p class="field submit">
                    <input class="btn submit" type="submit" value="Save Changes">
                </p>
    
            </fieldset>
        </form>
    </section>
`;

export async function edit(ctx) {
    const articleId = ctx.params.id;
    const article = await api.getArticleById(articleId);

    ctx.render(editArticleTemplate(article, onSubmit));
    ctx.setNavigation();

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const title = formData.get('title');
        const category = formData.get('category');
        const content = formData.get('content');

        if (title === '' || category === '' || content === '') {
            alert('All fields are required!');

            return false;
        }

        const allowedCategories = ['javascript', 'c#', 'java', 'python'];
        if (!allowedCategories.includes(category.toLocaleLowerCase())) {
            alert(`Category must be one of the following: ${allowedCategories}!`);

            return false;
        }

        const userId = sessionStorage.getItem('userId');
        const ownerId = article._ownerId;
        const isOwner = userId === ownerId;
        if (!isOwner) {
            alert('You must be logged-in and be the owner of this meme in order to edit it!');

            return false;
        }

        await api.editArticle(articleId, {
            title,
            category,
            content
        });

        ctx.page.redirect('/details/' + articleId);
    }
}