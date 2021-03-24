import * as api from './data.js';

export function logout(ctx) {
    api.logout();

    ctx.page.redirect('/');
}