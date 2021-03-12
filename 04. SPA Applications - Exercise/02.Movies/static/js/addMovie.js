import { getUserToken } from './login.js';

let main;
let addMovieSection;
let onSuccess;

export async function setupAddMovie(mainTargetElement, addMovieSectionTarget, onSuccessTarget) {
    main = mainTargetElement;
    addMovieSection = addMovieSectionTarget;
    onSuccess = onSuccessTarget;

    const addMovieForm = addMovieSection.querySelector('form');
    addMovieForm.addEventListener('submit', addMovie);
}

export async function showAddMovie() {
    main.innerHTML = '';
    main.appendChild(addMovieSection);
}

async function addMovie(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    let isAnyInputFieldEmpty = [...formData.entries()].some(x => x[1] === '');
    if (isAnyInputFieldEmpty) {
        let message = 'All fields are required and cannot be empty!';

        console.log(message);
        alert(message);

        return false;
    }

    let title = formData.get('title');
    let description = formData.get('description');
    let img = formData.get('img');

    try {
        const response = await fetch('http://localhost:3030/data/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': getUserToken()
            },
            body: JSON.stringify({
                title,
                description,
                img
            })
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        event.target.reset();
        await onSuccess();
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}