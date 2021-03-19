import { addTowns } from './towns.js';

window.addEventListener('load', () => {
    const btnLoadTowns = document.querySelector('#btnLoadTowns');
    btnLoadTowns.addEventListener('click', addTowns);
});