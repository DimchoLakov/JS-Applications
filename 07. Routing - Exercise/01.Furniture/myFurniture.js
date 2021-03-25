import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const itemTemplate = (data) => html`
    <div class="col-md-4">
        <div class="card text-white bg-primary">
            <div class="card-body">
                <img src=${fixLocalPath(data.img)} />
                <p>${data.description}</p>
                <footer>
                    <p>Price: <span>${data.price} $</span></p>
                </footer>
                <div>
                    <a href=${`/details/${data._id}`} class="btn btn-info">Details</a>
                </div>
            </div>
        </div>
    </div>
`;

const myFurnitureTemplate = (data) => html`
    <div class="row space-top">
        <div class="col-md-12">
            <h1>My Furniture</h1>
            <p>This is a list of your publications.</p>
        </div>
    </div>
    <div class="row space-top">
        ${data.map(itemTemplate)}
    </div>
`;

export async function myFurniturePage(ctx) {
    const furnitures = await api.getMyFurnitures();

    ctx.render(myFurnitureTemplate(furnitures));
    ctx.setActiveLink('myPublications');
}

function fixLocalPath(imgSrc) {
    if (imgSrc.includes('./images')) {
        return `.${imgSrc}`;
    }

    return imgSrc;
}