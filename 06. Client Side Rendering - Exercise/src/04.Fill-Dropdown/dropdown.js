import { html, render } from '../node_modules/lit-html/lit-html.js';

const optionTemplate = (option) => html`
    <option value=${option._id}>${option.text}</option>
`;

const fullTemplate = (data) => html`
    <h1>Dropdown Menu</h1>
    <article>
        <div>
            <select id="menu">
                ${data.map(optionTemplate)}
            </select>
        </div>
        <form @submit=${addItem}>
            <label for="itemText">
                Text:
            </label>
            <input type="text" id="itemText" />
            <input type="submit" value="Add">
        </form>
    </article>
`;

window.addEventListener('load', async () => {

    await update();

});

async function update() {
    let options = await getOptions();

    const body = document.body;
    const result = fullTemplate(options);

    render(result, body);
}

async function addItem(event) {
    event.preventDefault();

    let inputText = event.target.querySelector('#itemText');
    if (inputText.value === '') {
        const msg = 'Text cannot be empty!';
        
        console.log(msg);
        alert(msg);

        return false;
    }

    const response = await fetch('http://localhost:3030/jsonstore/advanced/dropdown ', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: inputText.value
        })
    });

    if (response.ok) {
        inputText.value = '';

        await update();
    }
}

async function getOptions() {
    const response = await fetch('http://localhost:3030/jsonstore/advanced/dropdown ');
    const data = await response.json();

    return Object.values(data);
}