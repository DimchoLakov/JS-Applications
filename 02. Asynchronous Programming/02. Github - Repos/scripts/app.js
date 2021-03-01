function loadRepos() {
	let usernameInput = document.querySelector('#username');
	let githubUsername = usernameInput.value;

	let url = `https://api.github.com/users/${githubUsername}/repos`;

	fetch(url)
		.then(response => {
			console.log(response);
			if (!response.ok) {
				let ul = document.querySelector('#repos');
				ul.innerHTML = '';

				let li = document.createElement('li');
				li.textContent = response.status;
				ul.appendChild(li);
			}

			return response.json();
		})
		.then(data => createListWithRepos(data))
		.catch(error => alert(error));

	function createListWithRepos(data) {
		if (data.message) {
			return;
		}

		let ul = document.querySelector('#repos');
		ul.innerHTML = '';

		Object.entries(data)
			.forEach(element => {
				let html_url = element[1].html_url;
				let repo_fullName = element[1].full_name;

				let a = document.createElement('a');
				a.href = html_url;
				a.textContent = repo_fullName;

				let li = document.createElement('li');
				li.appendChild(a);

				ul.appendChild(li);
			});
	}
}