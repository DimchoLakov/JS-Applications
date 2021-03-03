async function lockedProfile() {

    let firstProfileButton = document.querySelector('#main > .profile button');
    firstProfileButton.addEventListener('click', showHideUserInfo);

    let profiles = await getProfiles();
    displayAllProfiles(profiles);

    function displayAllProfiles(profiles) {
        let mainDiv = document.querySelector('#main');
        console.log(profiles)

        let counter = 2;
        Object.entries(profiles)
            .forEach(([key, value]) => {
                mainDiv.appendChild(createProfile(value, counter));
                counter++;
            });
    }

    function createProfile(profile, counter) {
        console.log(profile);

        const currentProfile = e('div', { className: 'profile' },
                                   e('img', { src: './iconProfile2.png', className: 'userIcon' }),
                                   e('label', {}, 'Lock '),
                                   e('input', { type: 'radio', name: `user${counter}Locked`, value: 'lock', checked: 'checked' }),
                                   e('label', {}, ' Unlock '),
                                   e('input', { type: 'radio', name: `user${counter}Locked`, value: 'unlock' }),
                                   e('br'),
                                   e('hr'),
                                   e('label', {}, 'Username '),
                                   e('input', { name: `user${counter}Username`, value: profile.username, disabled: 'true', readonly: 'true' }),
                                   e('div', { id: `user${counter}HiddenFields`, class: `user${counter}HiddenFields` },
                                       e('hr'),
                                       e('label', {}, 'Email: '),
                                       e('input', { type: 'email', name: `user${counter}Email`, value: profile.email, disabled: 'true', readonly: 'true' }),
                                       e('label', {}, 'Age: '),
                                       e('input', { type: 'email', name: `user${counter}Age`, value: profile.age, disabled: 'true', readonly: 'true' })),
                                   e('button', { onClick: showHideUserInfo }, 'Show more'));

        return currentProfile;
    }

    function showHideUserInfo(event) {
        event.preventDefault();

        let lockInput = this.parentNode.querySelector('input[value="lock"]');
        let unlockInput = this.parentNode.querySelector('input[value="unlock"]');
        let divHiddenUserInfo = this.parentNode.children[9];

        if (!lockInput.checked) {
            if (this.textContent.toLowerCase() === 'show more'.toLocaleLowerCase()) {
                this.textContent = 'Hide it';
                divHiddenUserInfo.style.display = 'block';
            } else {
                this.textContent = 'Show more';
                divHiddenUserInfo.style.display = 'none';
            }
        }
    }

    async function getProfiles() {
        try {
            const response = await fetch('http://localhost:3030/jsonstore/advanced/profiles');
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            alert(error.message);
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