const logoutButton = document.querySelector('#logoutBtn');
logoutButton.addEventListener('click', logout);

function logout(event) {
    event.preventDefault();

    sessionStorage.clear();
    window.location.href = './index.html';
}