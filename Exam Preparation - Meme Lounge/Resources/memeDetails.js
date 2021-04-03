import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const memeDetailsTemplate = (meme, isOwner, onDelete) => html`
    <section id="meme-details">
        <h1>Meme Title: ${meme.title}
        </h1>
        <div class="meme-details">
            <div class="meme-img">
                <img alt="meme-alt" src=${meme.imageUrl}>
            </div>
            <div class="meme-description">
                <h2>Meme Description</h2>
                <p>${meme.description}</p>
    
                ${isOwner ? 
                    html`
                        <a class="button warning" href=${`/edit/${meme._id}`}>Edit</a>
                        <button class="button danger" @click=${onDelete}>Delete</button>` : 
                        ''}
    
            </div>
        </div>
    </section>
`;

export async function memeDetails(ctx) {
    const memeId = ctx.params.id;
    const meme = await api.getMemeById(memeId);

    const userId = sessionStorage.getItem('userId');
    const ownerId = meme._ownerId;
    const isOwner = userId === ownerId;

    ctx.render(memeDetailsTemplate(meme, isOwner, onDelete));
    ctx.setNavigation();

    async function onDelete(event) {
        event.preventDefault();

        const isConfirmed = confirm('Are you sure you want to delete this Meme?');
        if (isConfirmed) {
            if (isOwner) {
                await api.deleteMeme(memeId);
            } else {
                alert('You must be logged-in and be the owner of this meme in order to delete it!');

                return false;
            }
        }

        ctx.page.redirect('/all');
    }
}