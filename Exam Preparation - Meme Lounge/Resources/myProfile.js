import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const memeTemplate = (meme) => html`
    <div class="user-meme">
        <p class="user-meme-title">${meme.title}</p>
        <img class="userProfileImage" alt="meme-img" src=${meme.imageUrl}>
        <a class="button" href=${`/details/${meme._id}`}>Details</a>
    </div>
`;

const myProfileTemplate = (username, email, memes, memesCount) => html`
    <section id="user-profile-page" class="user-profile">
        <article class="user-info">
            <img id="user-avatar-url" alt="user-profile" src="/images/female.png">
            <div class="user-content">
                <p>Username: ${username}</p>
                <p>Email: ${email}</p>
                <p>My memes count: ${memesCount}</p>
            </div>
        </article>
        <h1 id="user-listings-title">User Memes</h1>
        <div class="user-meme-listings">
            ${ memesCount === 0 ?
                html `<p class="no-memes">No memes in database.</p>` :
                memes.map(memeTemplate)}
        </div>
    </section>
`;

export async function myProfile(ctx) {
    const myMemes = await api.getMyMemes();
    const memesCount = myMemes.length;
    const username = sessionStorage.getItem('username');
    const email = sessionStorage.getItem('email');

    ctx.render(myProfileTemplate(username, email, myMemes, memesCount));
    ctx.setNavigation();
    ctx.setActiveLink('MyProfileLink');
}