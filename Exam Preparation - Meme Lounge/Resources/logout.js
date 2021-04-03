import * as api from './data.js';

export async function logout(ctx) {
    await api.logout();

    ctx.page.redirect('/');
}