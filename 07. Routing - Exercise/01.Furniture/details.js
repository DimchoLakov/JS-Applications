import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const detailsTemplate = (data) => html`<div class="row space-top">
    <div class="row space-top">
        <div class="col-md-12">
            <h1>Furniture Details</h1>
        </div>
    </div>
    <div class="row space-top">
        <div class="col-md-4">
            <div class="card text-white bg-primary">
                <div class="card-body">
                    <img src=${fixLocalPath(data.img)} />
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <p>Make: <span>${data.make}</span></p>
            <p>Model: <span>${data.model}</span></p>
            <p>Year: <span>${data.year}</span></p>
            <p>Description: <span>${data.description}</span></p>
            <p>Price: <span>${data.price}</span></p>
            <p>Material: <span>${data.material}</span></p>
            <div>
                <a href=${`/edit/${data._id}`} class="btn btn-info">Edit</a>
                <a href=${`/delete/${data._id}`} class="btn btn-red">Delete</a>
            </div>
        </div>
    </div>`;

export async function detailsPage(ctx) {
    const furnitureId = ctx.params.id;
    const furniture = await api.getFurnitureById(furnitureId);

    ctx.render(detailsTemplate(furniture));
}

function fixLocalPath(imgSrc) {
    if (imgSrc.includes('./images')) { 
        return `.${imgSrc}`;
    }

    return imgSrc;
}