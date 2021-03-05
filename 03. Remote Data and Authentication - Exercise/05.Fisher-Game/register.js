let registerForm = document.querySelector('form[action="/register"]');
registerForm.addEventListener('submit', register);

async function register(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let email = formData.get('email');
    let password = formData.get('password');
    let confirmPassword = formData.get('rePass');

    let isAnyInputFieldEmpty = [...formData].some(x => x[1] === '');
    if (isAnyInputFieldEmpty) {
        alert('All field are required and cannot be empty!');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Password and Repeat Password must have the same values!');
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
        window.location.href = './index.html';
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}