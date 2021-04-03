import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const createMemeTemplate = (onSubmit) => html`
    <section id="create-meme">
        <form id="create-form" @submit=${onSubmit}>
            <div class="container">
                <h1>Create Meme</h1>
                <label for="title">Title</label>
                <input id="title" type="text" placeholder="Enter Title" name="title">
                <label for="description">Description</label>
                <textarea id="description" placeholder="Enter Description" name="description"></textarea>
                <label for="imageUrl">Meme Image</label>
                <input id="imageUrl" type="text" placeholder="Enter meme ImageUrl" name="imageUrl">
                <input type="submit" class="registerbtn button" value="Create Meme">
            </div>
        </form>
    </section>
`;

export async function createMeme(ctx) {
    ctx.render(createMemeTemplate(onSubmit));
    ctx.setNavigation();
    ctx.setActiveLink('CreateMemeLink');

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const title = formData.get('title');
        const description = formData.get('description');
        const imageUrl = formData.get('imageUrl');

        if (title === '' || description === '' || imageUrl === '') {
            ctx.showNotifications('All fields are required!');
            
            return false;
        }

        try {
            await api.createMeme({
                title,
                description,
                imageUrl
            });
        } catch (error) {
            ctx.showNotifications(error.message);
            console.log(error.message);
            return false;
        }

        ctx.page.redirect('/all');
    }
}