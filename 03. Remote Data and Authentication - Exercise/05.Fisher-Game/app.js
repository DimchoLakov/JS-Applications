function attachEvents() {
    window.addEventListener('load', function () {
        enableOrDisableButtonsBasedOnLoggedInUser();

        let loadButton = document.querySelector('button.load');
        loadButton.addEventListener('click', async function (event) {
            event.preventDefault();
            await loadAllCatches();
        });

        let addButton = document.querySelector('.add');
        addButton.addEventListener('click', createCatch);
    });

    function isUserLoggedIn() {
        return getUserAuthToken() !== null;
    }

    function getUserAuthToken() {
        return sessionStorage.getItem('authToken');
    }

    function getOwnerId() {
        return sessionStorage.getItem('ownerId');
    }

    function enableOrDisableButtonsBasedOnLoggedInUser() {
        let allAddButtons = document.querySelectorAll('.add');
        let allUpdateButtons = document.querySelectorAll('.update');
        let allDeleteButtons = document.querySelectorAll('.delete');
        let divGuest = document.querySelector('#guest');

        if (isUserLoggedIn()) {
            allAddButtons.forEach(b => b.removeAttribute('disabled'));
            allUpdateButtons.forEach(b => b.removeAttribute('disabled'));
            allDeleteButtons.forEach(b => b.removeAttribute('disabled'));
            divGuest.style.display = 'none';
        } else {
            allAddButtons.forEach(b => b.setAttribute('disabled', true));
            allUpdateButtons.forEach(b => b.setAttribute('disabled', true));
            allDeleteButtons.forEach(b => b.setAttribute('disabled', true));
            divGuest.style.display = 'inline-block';
        }
    }

    async function loadAllCatches() {
        let catches = await getAllCatches();

        let divCatches = document.querySelector('#catches');
        divCatches.innerHTML = '';

        Object.values(catches)
            .map(c =>
                e('div', { className: 'catch' },
                    e('label', {}, 'Angler'),
                    e('input', { type: 'text', className: 'angler', value: c.angler }),
                    e('hr', {}),

                    e('label', {}, 'Weight'),
                    e('input', { type: 'number', className: 'weight', value: c.weight }),
                    e('hr', {}),

                    e('label', {}, 'Species'),
                    e('input', { type: 'text', className: 'species', value: c.species }),
                    e('hr', {}),

                    e('label', {}, 'Location'),
                    e('input', { type: 'text', className: 'location', value: c.location }),
                    e('hr', {}),

                    e('label', {}, 'Bait'),
                    e('input', { type: 'text', className: 'bait', value: c.bait }),
                    e('hr', {}),

                    e('label', {}, 'Capture Time'),
                    e('input', { type: 'number', className: 'captureTime', value: c.captureTime }),
                    e('hr', {}),

                    e('button', { className: 'update', onClick: updateCatch, ownerId: c._ownerId, catchId: c._id, disabled: !isUserLoggedIn() }, 'Update'),
                    e('button', { className: 'delete', onClick: deleteCatch, ownerId: c._ownerId, catchId: c._id, disabled: !isUserLoggedIn() }, 'Delete')
                ))
            .forEach(c => divCatches.appendChild(c));
    }

    async function updateCatch(event) {
        event.preventDefault();

        let catchOwnerId = getOwnerId();
        let ownerId = getOwnerId();

        if (catchOwnerId !== ownerId) {
            console.log('You must be the owner of this catch!');
            alert('You are not the owner of this Catch, so you can\'t update it');
            return false;
        }

        let catchId = event.target.catchId;
        let angler = event.target.parentNode.querySelector('input.angler').value;
        let weight = event.target.parentNode.querySelector('input.weight').value;
        let species = event.target.parentNode.querySelector('input.species').value;
        let location = event.target.parentNode.querySelector('input.location').value;
        let bait = event.target.parentNode.querySelector('input.bait').value;
        let captureTime = event.target.parentNode.querySelector('input.captureTime').value;
        if (angler === '' || weight === '' ||
            species === '' || location === '' ||
            bait === '' || captureTime === '') {

            alert('Fields cannot be empty!');

            return false;
        }

        try {
            const response = await fetch(`http://localhost:3030/data/catches/${catchId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': getUserAuthToken()
                },
                body: JSON.stringify({
                    angler,
                    weight,
                    species,
                    location,
                    bait,
                    captureTime
                })
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            loadAllCatches();
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    async function deleteCatch(event) {
        event.preventDefault();

        let catchOwnerId = event.target.ownerId;
        let ownerId = getOwnerId();

        if (catchOwnerId !== ownerId) {
            console.log('You must be the owner of this catch!');
            alert('You are not the owner of this Catch, so you can\'t delete it');
            return false;
        }

        let catchId = event.target.catchId;

        try {
            const response = await fetch(`http://localhost:3030/data/catches/${catchId}`, {
                method: 'DELETE',
                headers: {
                    'X-Authorization': getUserAuthToken()
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            loadAllCatches();
            event.target.parentNode.remove();
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    async function createCatch(event) {
        event.preventDefault();

        if (!isUserLoggedIn()) {
            console.log('You must be logged in!');
            alert('You must be logged in, in order to create a Catch!');
            return false;
        }

        let anglerInput = event.target.parentNode.querySelector('input.angler');
        let weightInput = event.target.parentNode.querySelector('input.weight');
        let speciesInput = event.target.parentNode.querySelector('input.species');
        let locationInput = event.target.parentNode.querySelector('input.location');
        let baitInput = event.target.parentNode.querySelector('input.bait');
        let captureTimeInput = event.target.parentNode.querySelector('input.captureTime');

        let angler = anglerInput.value;
        let weight = weightInput.value;
        let species = speciesInput.value;
        let location = locationInput.value;
        let bait = baitInput.value;
        let captureTime = captureTimeInput.value;

        if (anglerInput === '' || weightInput === '' ||
            speciesInput === '' || locationInput === '' ||
            baitInput === '' || captureTimeInput === '') {

            alert('Fields cannot be empty!');

            return false;
        }

        try {
            const response = await fetch('http://localhost:3030/data/catches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': getUserAuthToken()
                },
                body: JSON.stringify({
                    angler,
                    weight,
                    species,
                    location,
                    bait,
                    captureTime
                })
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            anglerInput.value = '';
            weightInput.value = '';
            speciesInput.value = '';
            locationInput.value = '';
            baitInput.value = '';
            captureTimeInput.value = '';

            const data = await response.json();
            sessionStorage.setItem('ownerId', data._ownerId);

            loadAllCatches();
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    async function getAllCatches() {
        try {
            const response = await fetch('http://localhost:3030/data/catches');
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }
}

function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}

attachEvents();

