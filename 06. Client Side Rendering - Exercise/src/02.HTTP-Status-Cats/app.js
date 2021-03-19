import { html, render } from '../node_modules/lit-html/lit-html.js';
import { cats } from './catSeeder.js';

window.addEventListener('load', () => {
    const catTemplate = (cat) => html`
    <li>
        <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
        <div class="info">
            <button class="showBtn" @click=${toggleStatusCodeDiv}>Show status code</button>
            <div class="status" style="display: none" id=${cat.id}>
                <h4>Status Code: ${cat.statusCode}</h4>
                <p>${cat.statusMessage}</p>
            </div>
        </div>
    </li>
    `;

    const catsTemplate = (cats) => html`
    <ul>
        ${cats.map(catTemplate)}
    </ul>
    `;

    const allCatsContainer = document.querySelector('#allCats');
    const result = catsTemplate(cats);

    render(result, allCatsContainer);
});

function toggleStatusCodeDiv(event) {
    event.preventDefault();

    let statusDiv = event.target.parentNode.querySelector('.status');
    let statusDivDisplay = statusDiv.style.display;

    if (statusDivDisplay === 'none') {
        statusDiv.style.display = 'block';
    } else {
        statusDiv.style.display = 'none';
    }
}