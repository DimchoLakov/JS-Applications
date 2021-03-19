import { html, render } from '../node_modules/lit-html/lit-html.js';

export function addTowns(event) {
    event.preventDefault();

    let townsInput = event.target.parentNode.querySelector('#towns');
    let towns = townsInput.value.split(',').map(t => t.trim());

    const townsTemplateResult = (data) => html`
        <ul>
            ${data.map(t => html`<li>${t}</li>`)}
        </ul>
    `;

    const result = townsTemplateResult(towns);
    const body = document.querySelector('#root');

    render(result, body);
}