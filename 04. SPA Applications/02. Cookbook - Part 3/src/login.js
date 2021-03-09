let loginForm = document.querySelector('form');
loginForm.addEventListener('submit', login);

async function login(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let email = formData.get('email');
    let password = formData.get('password');

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
        } else {
            const data = await response.json();
            sessionStorage.setItem('authToken', data.accessToken);
            window.location.href = './index.html';
        }
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}