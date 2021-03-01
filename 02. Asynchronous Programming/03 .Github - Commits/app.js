async function loadCommits() {
    try {
        let usernameInput = document.querySelector('#username');
        let repoInput = document.querySelector('#repo');

        let username = usernameInput.value;
        let repo = repoInput.value;

        let url = `https://api.github.com/repos/${username}/${repo}/commits`;
        const response = await fetch(url);

        if (!response.ok) {
            let responseMessage = '';
            if (response.status === 404) {
                responseMessage = 'Not Found';
            } else if (response.status === 400) {
                responseMessage = 'Bad Request';
            }
            throw new Error(`${response.status} - (${responseMessage})`);
        }

        const data = await response.json();

        let commitsDiv = document.querySelector('#commits');
        commitsDiv.innerHTML = '';

        Object.entries(data)
            .forEach(commitObj => {
                let content = `${commitObj[1].commit.author.name}: ${commitObj[1].commit.message}`;

                let li = document.createElement('li');
                li.textContent = content;

                commitsDiv.appendChild(li);
            });

    } catch (error) {
        let commitsDiv = document.querySelector('#commits');
        commitsDiv.innerHTML = '';

        let li = document.createElement('li');
        li.textContent = error;

        commitsDiv.appendChild(li);
    }
}