import { html } from '../node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const createArticleTemplate = (onSubmit) => html`
    <section id="create-page" class="content">
        <h1>Create Article</h1>
        <form id="create" action="#" method="" @submit=${onSubmit}>
            <fieldset>
                <p class="field title">
                    <label for="create-title">Title:</label>
                    <input type="text" id="create-title" name="title" placeholder="Enter article title">
                </p>
    
                <p class="field category">
                    <label for="create-category">Category:</label>
                    <input type="text" id="create-category" name="category" placeholder="Enter article category">
                </p>
                <p class="field">
                    <label for="create-content">Content:</label>
                    <textarea name="content" id="create-content"></textarea>
                </p>
    
                <p class="field submit">
                    <input class="btn submit" type="submit" value="Create">
                </p>
    
            </fieldset>
        </form>
    </section>
`;

export async function create(ctx) {
    ctx.render(createArticleTemplate(onSubmit));
    ctx.setNavigation();

    async function onSubmit(event) {
        event.preventDefault();

        const userId = sessionStorage.getItem('userId');
        if (userId === null) {
            alert('You must be logged-in in order to create an article!');

            return false;
        }

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

        try {
            await api.createArticle({
                title,
                category,
                content
            });
        } catch (error) {
            alert(error.message);
            console.log(error.message);
            return false;
        }

        ctx.page.redirect('/');
    }
}