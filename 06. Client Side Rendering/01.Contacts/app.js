import { contacts } from './contacts.js';
import { html, render } from './node_modules/lit-html/lit-html.js';

const contactCardTemplate = (data) => html`
<div class="contact card">
    <div>
        <i class="far fa-user-circle gravatar"></i>
    </div>
    <div class="info">
        <h2>Name: ${data.name}</h2>
        <button class="detailsBtn" @click=${toggleDetails}>Details</button>
        <div class="details" id=${data.id}>
            <p>Phone number: ${data.phoneNumber}</p>
            <p>Email: ${data.email}</p>
        </div>
    </div>
</div>
`;

const contactsResult = contacts.map(contact => contactCardTemplate(contact));
const contactsDiv = document.querySelector('#contacts');

render(contactsResult, contactsDiv);

function toggleDetails(event) {
    event.preventDefault();

    let detailsDiv = event.target.parentNode.querySelector('.details');
    const detailsDivDisplayProperty = detailsDiv.style.display;

    if (detailsDivDisplayProperty === 'block') {
        detailsDiv.style.display = 'none';
    } else {
        detailsDiv.style.display = 'block';
    }
}