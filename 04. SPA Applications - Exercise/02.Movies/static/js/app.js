import { displayNavMenu } from './nav.js';
import { setupLogin, showLogin } from './login.js';
import { setupHome, showHome } from './home.js';
import { setupRegister, showRegister } from './register.js';
import { logout } from './logout.js';
import { setupAddMovie } from './addMovie.js';
import { setupMovieDetails } from './movieDetails.js';
import { setupEditMovie } from './editMovie.js';

window.addEventListener('load', async () => {

    const main = document.querySelector('main');

    setupNavigation(main);
    setupHome(main, document.querySelector('#home-page'));
    setupAddMovie(main, document.querySelector('#add-movie'), showMainScreen);
    setupMovieDetails(main);
    setupEditMovie(main, document.querySelector('#edit-movie'), showMainScreen);

    displayNavMenu();
    await showMainScreen();

});

async function showMainScreen() {
    displayNavMenu();

    await showHome();
}

function setupNavigation(mainTag) {
    setupLogin(mainTag, document.querySelector('#form-login'), showMainScreen);
    setupRegister(mainTag, document.querySelector('#form-sign-up'), showMainScreen);

    const loginLink = document.querySelector('#LoginLink');
    loginLink.addEventListener('click', (event) => {
        event.preventDefault();

        showLogin();
    });

    const registerLink = document.querySelector('#RegisterLink');
    registerLink.addEventListener('click', (event) => {
        event.preventDefault();

        showRegister();
    });

    const logoutLink = document.querySelector('#LogoutLink');
    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();

        logout(showMainScreen);
    });

    const homeMoviesLink = document.querySelector('#HomeMoviesLink');
    homeMoviesLink.addEventListener('click', async (event) => {
        event.preventDefault();

        await showHome();
    });
}