import page from './node_modules/page/page.mjs';
import * as api from './data.js';

import { dashboardPage } from './dashboard.js';
import { createPage } from './create.js';
import { editPage } from './edit.js';
import { detailsPage } from './details.js';
import { myFurniturePage } from './myFurniture.js';
import { loginPage } from './login.js';
import { registerPage } from './register.js';
import { render } from './node_modules/lit-html/lit-html.js';

const mainConteiner = document.querySelector('.container');
window.api = api;

page('/', renderMiddleware, dashboardPage);
page('/index', renderMiddleware, dashboardPage);
page('/create', renderMiddleware, createPage);
page('/edit/:id', renderMiddleware, editPage);
page('/details/:id', renderMiddleware, detailsPage);
page('/my-furniture', renderMiddleware, myFurniturePage);
page('/login', renderMiddleware, loginPage);
page('/register', renderMiddleware, registerPage);
// page('/logout', renderMiddleware, logout);

page.start();

function renderMiddleware(ctx, next) {
    ctx.render = (content) => render(content, mainConteiner);
    next();
}