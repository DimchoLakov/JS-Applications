let registerForm = document.querySelector('form');
registerForm.addEventListener('submit', register);

async function register(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let email = formData.get('email');
    let password = formData.get('password');

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
        
    }

    const data = await response.json();
    sessionStorage.setItem('authToken', data.accessToken);
    window.location.href = './index.html';
}