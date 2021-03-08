let loginForm = document.querySelector('form[action="/login"]');
loginForm.addEventListener('submit', login);

async function login(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let email = formData.get('email');
    let password = formData.get('password');

    let isAnyInputFieldEmpty = [...formData].some(x => x[1] === '');
    if (isAnyInputFieldEmpty) {
        alert('All field are required and cannot be empty!');
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
        window.location.href = './home.html';
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}