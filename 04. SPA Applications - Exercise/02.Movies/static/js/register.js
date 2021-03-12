let main;
let registerSection;
let onSuccess;

export function setupRegister(mainTargetElement, registerTargetSection, onSuccessTarget) {
    main = mainTargetElement;
    registerSection = registerTargetSection;
    onSuccess = onSuccessTarget;

    let registerForm = registerSection.querySelector('form');
    registerForm.addEventListener('submit', register);
}

export function showRegister() {
    main.innerHTML = '';
    main.appendChild(registerSection);
}

async function register(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let email = formData.get('email');
    let password = formData.get('password');
    let confirmPassword = formData.get('repeatPassword');
    
    let isAnyInputFieldEmpty = [...formData.entries()].some(x => x[1] === '');
    if (isAnyInputFieldEmpty) {
        let message = 'All fields are required and cannot be empty!';

        console.log(message);
        alert(message);

        return false;
    }

    if (password !== confirmPassword) {
        let message = 'Passwords do not match!';

        console.log(message);
        alert(message);

        return false;
    }

    if (password.length < 6) {
        let message = 'Password be at least 6 characters long!';

        console.log(message);
        alert(message);

        return false;
    }

    try {
        const response = await fetch('http://localhost:3030/users/register', {
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