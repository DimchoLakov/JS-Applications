import { isUserLoggedIn, getUserEmail } from './login.js';

export function displayNavMenu() {
    let userElements = document.querySelectorAll('.user');
    let guestElements = document.querySelectorAll('.guest');

    if (isUserLoggedIn()) {
        userElements.forEach(e => {
            e.style.display = 'inline-block';
        });

        guestElements.forEach(e => {
            e.style.display = 'none';
        });

        setWelcomeLink();
    } else {
        userElements.forEach(e => {
            e.style.display = 'none';
        });

        guestElements.forEach(e => {
            e.style.display = 'inline-block';
        });
    }
}

function setWelcomeLink() {
    let welcomeLink = document.querySelector('#WelcomeLink');
    welcomeLink.textContent = `Welcome, ${getUserEmail()}`;
}