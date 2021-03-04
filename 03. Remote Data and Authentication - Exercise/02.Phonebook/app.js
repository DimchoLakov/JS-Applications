function attachEvents() {
    let buttonLoad = document.querySelector('#btnLoad');
    buttonLoad.addEventListener('click', async function (event) {
        event.preventDefault();

        await loadPhonebook();
    });

    let buttonCreate = document.querySelector('#btnCreate');
    buttonCreate.addEventListener('click', createPhonebookRecord);

    async function loadPhonebook() {
        try {
            const response = await fetch('http://localhost:3030/jsonstore/phonebook');
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();

            let ulPhonebook = document.querySelector('#phonebook');
            ulPhonebook.innerHTML = '';
            Object.entries(data)
                .map(([key, value]) => e('li', {}, `${value.person}: ${value.phone}`,
                    e('button', { id: 'deleteBtn', onClick: deletePhonebookRecord, phonebookId: key }, 'Delete')))
                .forEach(li => ulPhonebook.appendChild(li));
        } catch (error) {
            console.log(error.message);
        }
    }

    async function deletePhonebookRecord(event) {
        event.preventDefault();
        let id = event.target.phonebookId;

        try {
            const response = await fetch(`http://localhost:3030/jsonstore/phonebook/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            event.target.parentNode.remove();
        } catch (error) {
            console.log(error.message);
        }
    }

    async function createPhonebookRecord(event) {
        event.preventDefault();

        let personInput = document.querySelector('#person');
        let phoneInput = document.querySelector('#phone');

        try {
            const response = await fetch('http://localhost:3030/jsonstore/phonebook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    person: personInput.value,
                    phone: phoneInput.value
                })
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            personInput.value = '';
            phoneInput.value = '';
            await loadPhonebook();
        } catch (error) {
            console.log(error.message);
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
}

attachEvents();