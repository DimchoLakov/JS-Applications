import { html, render } from '../node_modules/lit-html/lit-html.js';

const tableRowTemplate = (tr, select) => html`
   <tr class=${select ? 'select'  : '' }>
      <td>${tr.firstName} ${tr.lastName}</td>
      <td>${tr.email}</td>
      <td>${tr.course}</td>
   </tr>
`;

window.addEventListener('load', async () => {
   let tableData = await loadTableData();

   let searchButton = document.querySelector('#searchBtn');
   searchButton.addEventListener('click', (event) => {
   const searchText = event.target.parentNode.querySelector('#searchField').value;

      update(tableData, searchText);
   });

   update(tableData);
});

function update(data, match = '') {
   const tableBody = document.querySelector('tbody');
   const result = data.map(tr => tableRowTemplate(tr, containsMatch(tr, match)));

   render(result, tableBody);
}

function containsMatch(tr, match) {
   return Object.values(tr).some(td => match && td.toLowerCase().includes(match.toLowerCase()));
}

async function loadTableData() {
   const response = await fetch('http://localhost:3030/jsonstore/advanced/table');
   const data = await response.json();

   return Object.values(data);
}