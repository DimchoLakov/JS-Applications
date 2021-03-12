import { getMovieDetails } from './movieDetails.js';
import { getUserToken } from './login.js';

let main;
let editMovieSection;
let onSuccess;
let movieId;

export async function setupEditMovie(mainTargetElement, editMovieSectionTarget, onSuccessTarget) {
    main = mainTargetElement;
    editMovieSection = editMovieSectionTarget;
    onSuccess = onSuccessTarget;

    const editMovieForm = editMovieSection.querySelector('form');
    editMovieForm.addEventListener('submit', editMovie);
}

export async function showEditMovie(event) {
    event.preventDefault();

    movieId = event.target.movieId;

    main.innerHTML = '';
    main.appendChild(editMovieSection);

    let movieDetails = await getMovieDetails(movieId);

    const editMovieForm = editMovieSection.querySelector('form');
    let inputTitle = editMovieForm.querySelector('input[name="title"]');
    let inputDescription = editMovieForm.querySelector('textarea[name="description"]');
    let inputImg = editMovieForm.querySelector('input[name="img"]');

    inputTitle.value = movieDetails.title;
    inputDescription.value = movieDetails.description;
    inputImg.value = movieDetails.img;
}

async function editMovie(event) {
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
        const response = await fetch(`http://localhost:3030/data/movies/${movieId}`, {
            method: 'PUT',
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