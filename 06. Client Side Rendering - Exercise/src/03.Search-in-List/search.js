import { html, render } from '../node_modules/lit-html/lit-html.js';
import { towns } from './towns.js';

const townListItemTemplate = (town, match) => html`
      <li class=${(match && town.toLowerCase().includes(match.toLowerCase())) ? 'active' : ''}>${town}</li>
   `;

const articleTemplate = (towns, match) => html`
   <article>
      <div id="towns">
         <ul>
            ${towns.map(t => townListItemTemplate(t, match))}
         </ul>
      </div>
      <input type="text" id="searchText" />
      <button @click=${search}>Search</button>
      <div id="result">${countMatches(towns, match)}</div>
   </article>
   `;

window.addEventListener('load', () => {
   update();
});

function update(match = '') {
   const body = document.body;
   const result = articleTemplate(towns, match);

   render(result, body);
}

function search(event) {
   event.preventDefault();

   let match = event.target.parentNode.querySelector('#searchText').value;
   update(match);
}

function countMatches(towns, match) {
   const matchesCount = towns.filter(town => match && town.toLowerCase().includes(match.toLowerCase())).length;

   return matchesCount === 0 ? '' : matchesCount === 1 ? `${matchesCount} match found` : `${matchesCount} matches found`;
}
