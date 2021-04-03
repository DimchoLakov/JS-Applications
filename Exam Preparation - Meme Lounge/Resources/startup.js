import page from './node_modules/page/page.mjs';
import { render } from './node_modules/lit-html/lit-html.js';

import { home } from './home.js';
import { login } from './login.js';
import { register } from './register.js';
import { logout } from './logout.js';
import { allMemes } from './allMemes.js';
import { createMeme } from './createMeme.js';
import { memeDetails } from './memeDetails.js';
import { editMeme } from './editMeme.js';
import { myProfile } from './myProfile.js';

const main = document.querySelector('main');

page('/', configureContext, home);
page('/login', configureContext, login);
page('/register', configureContext, register);
page('/logout', configureContext, logout);
page('/all', configureContext, allMemes);
page('/create', configureContext, createMeme);
page('/details/:id', configureContext, memeDetails);
page('/edit/:id', configureContext, editMeme);
page('/myProfile', configureContext, myProfile);

page.start();

function configureContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setActiveLink = setActiveLink;
    ctx.setNavigation = setNavigation;
    ctx.showNotifications = showNotifications;

    next();
}

function setNavigation() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        document.querySelector('.user').style.display = 'block';
        document.querySelector('.guest').style.display = 'none';

        const email = sessionStorage.getItem('email');
        const welcomeSpan = document.querySelector('#WelcomeSpan');
        welcomeSpan.textContent = `Welcome, ${email}`;
    } else {
        document.querySelector('.user').style.display = 'none';
        document.querySelector('.guest').style.display = 'block';

        const welcomeSpan = document.querySelector('#WelcomeSpan');
        welcomeSpan.textContent = '';
    }
}

function setActiveLink(elementId) {
    const navLinks = [...document.querySelectorAll('nav a')];
    navLinks.forEach(e => e.classList.remove('active'));

    const activeLink = navLinks.find(e => e.id === elementId);
    activeLink.classList.add('active');
}

function showNotifications(message) {
    const notificationsDiv = document.querySelector('#errorBox');
    notificationsDiv.style.display = 'block';

    const span = notificationsDiv.querySelector('span');
    span.textContent = message;

    setTimeout(() => {
        span.textContent = '';
        notificationsDiv.style.display = 'none';
    }, 3000);
}