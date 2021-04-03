import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const editMemeTemplate = (meme, onSubmit) => html`
    <section id="edit-meme">
        <form id="edit-form" @submit=${onSubmit}>
            <h1>Edit Meme</h1>
            <div class="container">
                <label for="title">Title</label>
                <input id="title" type="text" placeholder="Enter Title" name="title" .value=${meme.title}>
                <label for="description">Description</label>
                <textarea id="description" placeholder="Enter Description" name="description" .value=${meme.description}>
                                                Programming is often touted as a smart and lucrative career path.
                                                It's a job that (sometimes) offers flexibility and great benefits.
                                                But it's far from sunshine and Nyan Cat rainbows. The hours are long.
                                                The mistakes are frustrating. And your eyesight is almost guaranteed to suffer.
                                                These memes cover most of the frustration (and funny moments) of programming.
                                                At least we can laugh through the pain. 
                                            </textarea>
                <label for="imageUrl">Image Url</label>
                <input id="imageUrl" type="text" placeholder="Enter Meme ImageUrl" name="imageUrl" .value=${meme.imageUrl}>
                <input type="submit" class="registerbtn button" value="Edit Meme">
            </div>
        </form>
    </section>
`;

export async function editMeme(ctx) {
    const memeId = ctx.params.id;
    const meme = await api.getMemeById(memeId);

    ctx.render(editMemeTemplate(meme, onSubmit));
    ctx.setNavigation();

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

        const userId = sessionStorage.getItem('userId');
        const ownerId = meme._ownerId;
        const isOwner = userId === ownerId;
        if (!isOwner) {
            ctx.showNotifications('You must be logged-in and be the owner of this meme in order to edit it!');

            return false;
        }

        await api.editMeme(memeId, {
            title,
            description,
            imageUrl
        });

        ctx.page.redirect('/details/' + memeId);
    }
}