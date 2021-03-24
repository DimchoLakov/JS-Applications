import * as api from './data.js';

export async function deleteFurniture(ctx) {
    const furnitureId = ctx.params.id;
    const furniture = await api.getFurnitureById(furnitureId);

    const ownerId = furniture._ownerId;
    const userId = sessionStorage.getItem('userId');

    if (userId === null || userId === undefined) {
        alert('Please login!');

        ctx.page.redirect(`/login`);

        return false;
    }

    if (ownerId !== userId) {
        alert('You must be the owner of the furniture in order to Edit it!');

        ctx.page.redirect(`/details/${furnitureId}`);

        return false;
    }

    const confirmed = confirm('Are you sure you want to delete this furniture?');
    if (confirmed) {
        await api.deleteFurniture(furnitureId);

        ctx.page.redirect('/');
    }
}