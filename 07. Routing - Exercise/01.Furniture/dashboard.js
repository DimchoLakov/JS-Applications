import { html } from './node_modules/lit-html/lit-html.js';
import * as api from './data.js';

const dashboardTemplate = (data) => html`
    <div class="row space-top">
        ${data.map(itemTemplate)}
    </div>
`;

const itemTemplate = (furniture) => html`
    <div class="col-md-4">
        <div class="card text-white bg-primary">
            <div class="card-body">
                <img src=${furniture.img} />
                <p>${furniture.description}</p>
                <footer>
                    <p>Price: <span>${furniture.price} $</span></p>
                </footer>
                <div>
                    <a href=${`/details/${furniture._id}`} class="btn btn-info">Details</a>
                </div>
            </div>
        </div>
    </div>
`;

export async function dashboardPage(ctx) {
    ctx.setNavigation();
    ctx.setActiveLink('catalogLink');
    
    const data = await api.getAllFurnitures();
    
    ctx.render(dashboardTemplate(data));
}