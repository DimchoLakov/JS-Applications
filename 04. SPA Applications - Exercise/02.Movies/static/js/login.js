let main;
let loginSection;
let onSuccess;

export function isUserLoggedIn() {
    return getUserToken() !== null;
}

export function getUserToken() {
    return sessionStorage.getItem('authToken');
}

export function getUserId() {
    return sessionStorage.getItem('userId');
}

export function getUserEmail() {
    return sessionStorage.getItem('userEmail');
}

export function setupLogin(mainTargetElement, loginTargetSection, onSuccessTarget) {
    main = mainTargetElement;
    loginSection = loginTargetSection;
    onSuccess = onSuccessTarget;

    let loginForm = loginSection.querySelector('form');
    loginForm.addEventListener('submit', login);
}

export function showLogin() {
    main.innerHTML = '';
    main.appendChild(loginSection);
}

async function login(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let email = formData.get('email');
    let password = formData.get('password');

    let isAnyInputFieldEmpty = [...formData.entries()].some(x => x[1] === '');
    if (isAnyInputFieldEmpty) {
        let message = 'All fields are required and cannot be empty!';

        console.log(message);
        alert(message);

        return false;
    }

    try {
        const response = await fetch('http://localhost:3030/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        sessionStorage.setItem('authToken', data.accessToken);
        sessionStorage.setItem('userId', data._id);
        sessionStorage.setItem('userEmail', email);

        event.target.reset();
        onSuccess();

    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}