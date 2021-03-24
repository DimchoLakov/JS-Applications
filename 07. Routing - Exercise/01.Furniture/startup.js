import page from './node_modules/page/page.mjs';
import { render } from './node_modules/lit-html/lit-html.js';

import { dashboardPage } from './dashboard.js';
import { createPage } from './create.js';
import { editPage } from './edit.js';
import { detailsPage } from './details.js';
import { deleteFurniture } from './delete.js';
import { myFurniturePage } from './myFurniture.js';
import { loginPage } from './login.js';
import { registerPage } from './register.js';
import { logout } from './logout.js';

const mainConteiner = document.querySelector('.container');

page('/', configureContext, dashboardPage);
page('/index', configureContext, dashboardPage);
page('/create', configureContext, createPage);
page('/edit/:id', configureContext, editPage);
page('/details/:id', configureContext, detailsPage);
page('/delete/:id', configureContext, deleteFurniture)
page('/my-furnitures', configureContext, myFurniturePage);
page('/login', configureContext, loginPage);
page('/register', configureContext, registerPage);
page('/logout', logout);

setNavigation();

page.start();

function configureContext(ctx, next) {
    ctx.render = (content) => render(content, mainConteiner);
    ctx.setNavigation = setNavigation;
    next();
}

function setNavigation() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        document.querySelector('#user').style.display = 'inline-block';
        document.querySelector('#guest').style.display = 'none';
    } else {
        document.querySelector('#user').style.display = 'none';
        document.querySelector('#guest').style.display = 'inline-block';
    }
}