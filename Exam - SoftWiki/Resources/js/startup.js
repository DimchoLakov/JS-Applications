import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';

import { home } from './home.js';
import { login } from './login.js';
import { register } from './register.js';
import { logout } from './logout.js';
import { catalogue } from './catalogue.js';
import { create } from './create.js';
import { details } from './details.js';
import { edit } from './edit.js';
import { search } from './search.js';

const main = document.querySelector('main');

page('/', configureContext, home);
page('/login', configureContext, login);
page('/register', configureContext, register);
page('/logout', configureContext, logout);
page('/catalogue', configureContext, catalogue);
page('/create', configureContext, create);
page('/details/:id', configureContext, details);
page('/edit/:id', configureContext, edit);
page('/search', configureContext, search);

page.start();

function configureContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setNavigation = setNavigation;

    next();
}

function setNavigation() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        document.querySelector('#user').style.display = 'block';
        document.querySelector('#guest').style.display = 'none';
    } else {
        document.querySelector('#user').style.display = 'none';
        document.querySelector('#guest').style.display = 'block';
    }
}